import { Request, Response, NextFunction } from "express";
import { QueryTypes } from "sequelize";
import i18n from "i18next";
import fs from "fs";
import mime from "mime-types";
import ApiController from "./apiController";
import Role from "../models/role";
import Country from "../models/country";
import Partner from "../models/partner";
import TmpFile from "../models/tmpFile";
import PartnerDocument from "../models/partnerDocument";
import HttpException from "../exceptions/httpException";
import PartnerNotFind from "../exceptions/partner/partnerNotFind";
import BadPermissions from "../exceptions/badPermissions";
import BadValidationException from "../exceptions/badValidationException";
import BadRole from "../exceptions/user/badRole";
import PartnerWithoutAuthorised from "../exceptions/partner/partnerWithoutAuthorised";
import putPartnerInformation from "../requests/partner/putPartnerInformation";
import PartnerHelper from "../helpers/partnerHelper";
import UserHelper from "../helpers/userHelper";
import DocumentHelper from "../helpers/documentHelper";
import sequelize from "../services/sequelize";
import event from "../services/event";
import PartnerApproved from "../events/partnerApproved";
import PartnerRejected from "../events/partnerRejected";
import PartnerRepository from "../repositories/partnerRepository";
import Pagination from "../services/pagination";
import Project from "../models/project";
import ProjectHelper from "../helpers/projectHelper";
import ProjectRepository from "../repositories/projectRepository";
import exceptionHandler from "../services/exceptionHandler";

class PartnerController {
    static getPartnerProperties = async (req: Request, res: Response) => {
        let responseData: any = {};
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);

        if (!req.query.key || req.query.key == 'roles') {
            // roles
            let roles = await sequelize.query('select "id", "title' + lang + '" as "title" FROM roles WHERE "id"=\'' +Role.partnerAssistId+ '\' OR "id"=\'' +Role.partnerAuthorisedId+ '\'',
            {type: QueryTypes.SELECT});
            responseData['roles'] = roles;
        }
        
        if (!req.query.key || req.query.key == 'countries') {
            // countries
            let countries: Country[]|null = await Country.findAll({attributes: ['id', 'title']});
            responseData['countries'] = countries;
        }

        
        if (!req.query.key || req.query.key == 'companies') {
            const query = `select
            p."id" as "id",
            p."nameEn" as "title"
            from partners p
            left join
              (select p."id" as "parId", SUM(uhrassist."userId") as "ASSISTID", SUM(uhrauthorised."userId") as "AUTHORISEDID"
            from partners p
            left join users u on u."partnerId" = p."id"
            left join users_has_roles uhrassist on uhrassist."userId" = u."id" and uhrassist."roleId" = '${Role.partnerAssistId}'
            left join users_has_roles uhrauthorised on uhrauthorised."userId" = u."id" and uhrauthorised."roleId" = '${Role.partnerAuthorisedId}'
          group by p."id") ap on ap."parId" = p.id
          where ap."AUTHORISEDID" is null`
            let companies = await sequelize.query(query,
            {type: QueryTypes.SELECT});
            
            responseData['companies'] = companies;
        }
        
        if (!req.query.key || req.query.key == 'areasOfWork') {
            // areas of work
            let areasOfWork: never[] = await sequelize.query('select "id", "title' + lang + '" as "title" FROM areas_of_work', {type: QueryTypes.SELECT});
            responseData['areasOfWork'] = areasOfWork;
        }
        
        if (!req.query.key || req.query.key == 'ownerships') {
            // company ownerships
            let companyOwnerships: never[] = await sequelize.query('select "id", "title' + lang + '" as "title" FROM companys_ownerships', {type: QueryTypes.SELECT});
            responseData['ownerships'] = companyOwnerships;
        }
        
        if (!req.query.key || req.query.key == 'partnerTypes') {
            // partner types
            let partnerTypes: never[] = await sequelize.query('select "id", "title' + lang + '" as "title" FROM partner_types', {type: QueryTypes.SELECT});
            responseData['partnerTypes'] = partnerTypes;
        }
        
        if (!req.query.key || req.query.key == 'csoTypes') {
            // CSO types
            let csoTypes: never[] = await sequelize.query('select "id", "title' + lang + '" as "title" FROM cso_types', {type: QueryTypes.SELECT});
            responseData['csoTypes'] = csoTypes;
        }

        ApiController.success(responseData, res);
        return ;
    }

    static updatePartner = async (req: Request, res: Response, next: NextFunction) => {
        const transaction = await sequelize.transaction();
        try {
            const partnerId = req.body.company.id;
            const user = req.user;
            const userPartner = await UserHelper.getUserPartner(user);

            if ((!user.hasRole(Role.partnerAssistId) && !user.hasRole(Role.partnerAuthorisedId)) || userPartner==null || userPartner.id!==partnerId) {
                throw new BadPermissions();
            }

            // validate unput params 
            const isParamsValid = putPartnerInformation(req, res, next);
            if (!isParamsValid) {
                throw new BadValidationException();
            }

            const partner = await Partner.findByPk(partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req.body.company);
            
            if (PartnerHelper.isPartnerDataDifferent(partnerData, partner)) {
                partnerData.statusId = Partner.partnerStatusFilled;
            }
            await partner.update(partnerData, {transaction: transaction});

            if (user.hasRole(Role.partnerAssistId)) {
                // update authorised person information
                const authPerson = await PartnerHelper.getPartnerAuthorised(partner);
                if (authPerson == null) {
                    throw new PartnerWithoutAuthorised();
                }
                const authorisedData: any = {
                    firstNameEn: req.body.authorisedPerson.firstNameEn,
                    firstNameRu: req.body.authorisedPerson.firstNameRu,
                    lastNameEn: req.body.authorisedPerson.lastNameEn,
                    lastNameRu: req.body.authorisedPerson.lastNameRu,
                    occupationEn: req.body.authorisedPerson.occupationEn,
                    occupationRu: req.body.authorisedPerson.occupationRu
                }
                authPerson.personalData.update(authorisedData, {transaction: transaction});
            }
            transaction.commit();

            return ApiController.success({
                message: i18n.t('successPartnerSaving')
            }, res);
        } catch (error) {
            transaction.rollback();
            return exceptionHandler(error, res);
        }
    }

    static approve = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user.isAdmin() && !req.user.isUnicefUser()) {
                throw new BadRole(403, 330, i18n.t('accessDenied'), "User needs to be admin or UNICEF role");
            }
    
            const partnerId = req.body.id || null;
            if (partnerId == null) {
                throw new BadValidationException();
            }

            const partner = await Partner.findOne({
                where: {
                    id: partnerId
                }
            });
            if (partner && partner.statusId == Partner.partnerStatusFilled) {
                partner.statusId = Partner.partnerStatusApproved;
                await partner.save();

                event(new PartnerApproved(partner));

                const responseData = {
                    message: i18n.t('successPartnerApprove'),
                    statusId: partner.statusId
                }
    
                return ApiController.success(responseData, res);
            }

            throw new PartnerNotFind();
        } catch(error) {
            return exceptionHandler(error, res);
        }
    }

    static reject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user.isAdmin() && !req.user.isUnicefUser()) {
                throw new BadRole(403, 330, i18n.t('accessDenied'), "User needs to be admin or UNICEF role");
            }
    
            const partnerId = req.body.id || null;
            const rejectReason = req.body.reason;
            if (partnerId == null) {
                throw new BadValidationException();
            }

            const partner = await Partner.findOne({
                where: {
                    id: partnerId
                }
            });
            if (partner && partner.statusId == Partner.partnerStatusFilled) {
                partner.statusId = Partner.partnerStatusRejected;
                await partner.save();

                event(new PartnerRejected(partner, rejectReason));

                const responseData = {
                    message: i18n.t('successPartnerReject'),
                    statusId: partner.statusId
                }
    
                return ApiController.success(responseData, res);
            }

            throw new PartnerNotFind();
        } catch(error) {
            return exceptionHandler(error, res);
        }
    }

    static updateDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const partner = await UserHelper.getUserPartner(user);
    
            if (partner == null) {
                throw new PartnerNotFind();
            }
    
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    DocumentHelper.transferDocumentFromTemp(element.id, element.title, partner);
                });
            }

            return ApiController.success({
                message: i18n.t('successUpdatedDocuments')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static list = async (req: Request, res: Response) => {
        try {
            if (!req.user.isUnicefUser() && !req.user.isAdmin()) {
                throw new BadRole();
            }
            let pagination = new Pagination(req, 15);
            let searchInstanse = req.query.search?req.query.search:null;
            const partners = await PartnerRepository.getList(searchInstanse, pagination);
    
            const responseData = {
                partners: partners,
                currentPage: pagination.getCurrentPage(),
                lastPage: pagination.getLastPage()
            }
    
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static details = async (req: Request, res: Response) => {
        try {
            if (!req.user.isUnicefUser() && !req.user.isAdmin()) {
                throw new BadRole();
            }
            const partnerId = req.query.id;
            const partner = await PartnerRepository.getFullInformation(partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            
            return ApiController.success(partner, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getPartnerById = async (req: Request, res: Response) => {
        try {
            const partnerId = req.query.id;
            const partner = await PartnerRepository.findById(partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            
            return ApiController.success(partner, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getDocuments = async (req: Request, res: Response) => {
        try {
            const partnerId = req.query.id;
            const partner = await Partner.findByPk(partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            await partner.getAssistId();
            await partner.getAuthorisedId();
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin() && !req.user.isUnicefUser()) {
                throw new BadPermissions();
            }

            // get partner documents
            const partnerDocuments = await PartnerDocument.findAll({
                where: {
                    partnerId: partner.id
                }
            });

            let responseData: any = [];

            if (partnerDocuments instanceof Array && partnerDocuments.length>0) {
                partnerDocuments.forEach((element) => {
                    responseData.push({
                        href: element.href,
                        id: element.id,
                        title: element.title
                    })
                })
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static downloadDocument = async (req: Request, res: Response) => {
        try {
            const documentId = req.query.id;

            const partnerDocument = await PartnerDocument.findByPk(documentId);
            if (partnerDocument == null) {
                throw new PartnerNotFind(400, 110, i18n.t('documentNotFindError'), 'Document not found');
            }
            // check permissions
            const partner = await Partner.findByPk(partnerDocument.partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            await partner.getAssistId();
            await partner.getAuthorisedId();
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin() && !req.user.isUnicefUser()) {
                throw new BadPermissions();
            }
    
            const filePath = partnerDocument.getFilePath();
            const fileBuffer = fs.readFileSync(filePath);

            const base64 = Buffer.from(fileBuffer).toString('base64');
            const contentType = mime.contentType(partnerDocument.getPublicFilename());
            if (contentType) {
                const responseData = {
                        filename : partnerDocument.getPublicFilename(),
                        contentType: contentType,
                        doc: base64
                    };
                ApiController.success(responseData, res);
                return ;
            } else {
                ApiController.failed(500, 'document wasn\'t found', res);
                return ;
            }
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static deleteDocument = async (req: Request, res: Response) => {
        try {
            const documentId = req.query.id;
            const partnerDocument = await PartnerDocument.findByPk(documentId);
            if (partnerDocument == null) {
                throw new PartnerNotFind(400, 110, i18n.t('documentNotFindError'), 'Document not found');
            }
    
            // check permissions
            const partner = await Partner.findByPk(partnerDocument.partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            await partner.getAssistId();
            await partner.getAuthorisedId();
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin()) {
                throw new BadPermissions();
            }
            if (partnerDocument.title == 'Partner Declaration Profile and due Diligence Verification Form') {
                partner.statusId = Partner.partnerStatusFilled;
                partner.save();
            }

            await partnerDocument.destroy();

            ApiController.success({
                message: i18n.t('successDeleteDoc')
            }, res)

        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    // Get list of available partners for assigning to project
    static availableList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const partners = await PartnerRepository.findAvailable();

            return ApiController.success({partners: partners}, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getProjects = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const partnerId = req.query.id;

            let pagination = new Pagination(req, 15);
            let searchInstanse = req.query.search?req.query.search:null;
            const projects = await ProjectRepository.getListForPartner(partnerId, searchInstanse, pagination);
            
            const responseData = {
                projects: projects,
                currentPage: pagination.getCurrentPage(),
                lastPage: pagination.getLastPage()
            }
    
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default PartnerController;