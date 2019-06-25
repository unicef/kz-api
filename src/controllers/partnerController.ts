import { Request, Response, NextFunction } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import stream from "stream";
import i18n from "i18next";
import fs from "fs";
import mime from "mime-types";
import ApiController from "./apiController";
import config from "../config/config";
import Role from "../models/role";
import Country from "../models/country";
import AreaOfWork from "../models/areaOfWork";
import CompanyOwnership from "../models/companyOwnership";
import PartnerType from "../models/partnerType";
import CSOType from "../models/csoType";
import User from "../models/user";
import Partner from "../models/partner";
import UserPersonalData from "../models/userPersonalData";
import { Resolver } from "dns";
import TmpFile from "../models/tmpFile";
import HttpException from "../exceptions/httpException";
import PartnerNotFind from "../exceptions/partnerNotFind";
import BadPermissions from "../exceptions/badPermissions";
import PartnerDocument from "../models/partnerDocument";
import putPartnerInformation from "../requests/partner/putPartnerInformation";
import BadValidationException from "../exceptions/badValidationException";
import PartnerHelper from "../helpers/partnerHelper";
import PartnerWithoutAuthorised from "../exceptions/partnerWithoutAuthorised";
import UserHelper from "../helpers/userHelper";
import DocumentHelper from "../helpers/documentHelper";

class PartnerController {
    static getPartnerProperties = async (req: Request, res: Response) => {
        let responseData: any = {};

        if (!req.query.key || req.query.key == 'roles') {
            // roles
            let roles: Role[]|null = await Role.getPartnerRoles();
            responseData['roles'] = roles;
        }
        
        if (!req.query.key || req.query.key == 'countries') {
            // countries
            let countries: Country[]|null = await Country.findAll({attributes: ['id', 'title']});
            responseData['countries'] = countries;
        }

        
        if (!req.query.key || req.query.key == 'companies') {
            // countries
            let companies: Partner[]|null = await Partner.findAll({
                where: {
                    authorisedId: null
                },
                attributes: ['id', 'nameEn']
            });
            responseData['companies'] = companies;
        }
        
        if (!req.query.key || req.query.key == 'areasOfWork') {
            // areas of work
            let areasOfWork: AreaOfWork[]|null = await AreaOfWork.findAll();
            responseData['areasOfWork'] = areasOfWork;
        }
        
        if (!req.query.key || req.query.key == 'ownerships') {
            // company ownerships
            let companyOwnerships: CompanyOwnership[]|null = await CompanyOwnership.findAll();
            responseData['ownerships'] = companyOwnerships;
        }
        
        if (!req.query.key || req.query.key == 'partnerTypes') {
            // partner types
            let partnerTypes: PartnerType[]|null = await PartnerType.findAll();
            responseData['partnerTypes'] = partnerTypes;
        }
        
        if (!req.query.key || req.query.key == 'csoTypes') {
            // CSO types
            let csoTypes: CSOType[]|null = await CSOType.findAll();
            responseData['csoTypes'] = csoTypes;
        }

        ApiController.success(responseData, res);
        return ;
    }

    static createPartner = async (req: Request, res: Response) => {
        // creating authorised person
        const passwordSalt: string = cryptoRandomString(10);
        const randPassword: string = cryptoRandomString(10);
        try {
            let authorizePerson = await User.create({
                email: req.body.authorised.email,
                password: User.generatePassword(passwordSalt, randPassword),
                passwordSalt: passwordSalt
            });
            const role = await Role.findByPk('ap');
            authorizePerson.addRole(role);

            let authorizePersonalData = UserPersonalData.create({
                userId: authorizePerson.id,
                firstNameEn: req.body.authorised.firstNameEn,
                firstNameRu: req.body.authorised.firstNameRu,
                lastNameEn: req.body.authorised.lastNameEn,
                lastNameRu: req.body.authorised.lastNameRu,
                occupationEn: req.body.authorised.occupationEn,
                occupationRu: req.body.authorised.occupationRu
            });

            const partner = await Partner.create({
                statusId: Partner.partnerStatusFilled,
                assistId: req.user.id,
                authorisedId: authorizePerson.id,
                nameEn: req.body.nameEn,
                nameRu: req.body.nameRu,
                tradeNameEn: req.body.tradeNameEn,
                tradeNameRu: req.body.tradeNameRu,
                license: req.body.license,
                countryId: req.body.countryId,
                ceoFirstNameEn: req.body.ceoFirstNameEn,
                ceoFirstNameRu: req.body.ceoFirstNameRu,
                ceoLastNameEn: req.body.ceoLastNameEn,
                ceoLastNameRu: req.body.ceoLastNameRu,
                establishmentYear: req.body.establishmentYear,
                employersCount: req.body.employersCount,
                areaOfWorkId: req.body.areaOfWorkId,
                ownershipId: req.body.ownershipId,
                partnerTypeId: req.body.partnerTypeId,
                csoTypeId: req.body.csoTypeId,
                tel: req.body.tel,
                website: req.body.website,
                cityEn: req.body.cityEn,
                cityRu: req.body.cityRu,
                addressEn: req.body.addressEn,
                addressRu: req.body.addressRu,
                zip: req.body.zip,
            })

            ApiController.success({
                message: i18n.t('successPartnerCreation'),
                partnerId: partner.id
            }, res);
            return ;
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static updatePartner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const partnerId = req.body.company.id;
            const user = req.user;
            const userPartner = await UserHelper.getUserPartner(user.id);

            if ((!user.hasRole('ra') && !user.hasRole('ap')) || userPartner==null || userPartner.id!==partnerId) {
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
            await partner.update(partnerData);

            if (user.hasRole('ra')) {
                // update authorised person information
                const authPerson = await User.findByPk(partner.authorisedId);
                if (authPerson == null) {
                    throw new PartnerWithoutAuthorised();
                }
                // get authorised person data
                const authorisedData: any = {
                    firstNameEn: req.body.authorisedPerson.firstNameEn,
                    firstNameRu: req.body.authorisedPerson.firstNameRu,
                    lastNameEn: req.body.authorisedPerson.lastNameEn,
                    lastNameRu: req.body.authorisedPerson.lastNameRu,
                    occupationEn: req.body.authorisedPerson.occupationEn,
                    occupationRu: req.body.authorisedPerson.occupationRu
                }
                await authPerson.update(authorisedData);
            }

            return ApiController.success({
                message: i18n.t('successPartnerSaving')
            }, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static updateDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const partner = await UserHelper.getUserPartner(user.id);
    
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
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getPartnerById = async (req: Request, res: Response) => {
        const partnerId = req.query.id;
        const partner = await Partner.findOne({
            where: {
                id: partnerId
            },
            include: [
                Partner.associations.country,
                Partner.associations.areaOfWork,
                Partner.associations.ownership,
                Partner.associations.partnerType,
                Partner.associations.csoType
            ]
        })

        if (partner) {
            ApiController.success(partner, res);
        } else {
            ApiController.failed(404, 'Partner didn\'t find', res);
        }
    }

    static uploadingDocument = async (req: Request, res: Response) => {
        try {
            const tmpFile = await TmpFile.create({
                id: req.file.filename,
                userId: req.user.id,
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size
            });
            ApiController.success({id: tmpFile.id}, res);
            return;
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getDocuments = async (req: Request, res: Response) => {
        try {
            const partnerId = req.query.id;
            const partner = await Partner.findByPk(partnerId);
            if (partner == null) {
                throw new PartnerNotFind();
            }
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin()) {
                throw new BadPermissions();
            }

            // get partner documents
            const partnerDocuments = await PartnerDocument.findAll({
                where: {
                    partnerId: partner.id
                }
            })

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
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
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
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin()) {
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
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
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
            if (partner.assistId != req.user.id && partner.authorisedId != req.user.id && !req.user.isAdmin()) {
                throw new BadPermissions();
            }

            await partnerDocument.destroy();

            ApiController.success({
                message: i18n.t('successDeleteDoc')
            }, res)

        } catch (error) {

        }
    }
}

export default PartnerController;