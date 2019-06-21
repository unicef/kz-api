import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import stream from "stream";
import i18n from "i18next";
import fs from "fs";
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
        // creating authorized person
        const passwordSalt: string = cryptoRandomString(10);
        const randPassword: string = cryptoRandomString(10);
        try {
            let authorizePerson = await User.create({
                email: req.body.authorized.email,
                password: User.generatePassword(passwordSalt, randPassword),
                passwordSalt: passwordSalt
            });
            const role = await Role.findByPk('ap');
            authorizePerson.addRole(role);

            let authorizePersonalData = UserPersonalData.create({
                userId: authorizePerson.id,
                firstNameEn: req.body.authorized.firstNameEn,
                firstNameRu: req.body.authorized.firstNameRu,
                lastNameEn: req.body.authorized.lastNameEn,
                lastNameRu: req.body.authorized.lastNameRu,
                occupationEn: req.body.authorized.occupationEn,
                occupationRu: req.body.authorized.occupationRu
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
            ApiController.failed(error.status, error.message, res, undefined);
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
            res.send(base64);
            return ;
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