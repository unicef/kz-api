import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import i18n from "i18next";
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
            let countries: Country[]|null = await Country.findAll();
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
                seoFirstNameEn: req.body.seoFirstNameEn,
                seoFirstNameRu: req.body.seoFirstNameRu,
                seoLastNameEn: req.body.seoLastNameEn,
                seoLastNameRu: req.body.seoLastNameRu,
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
}

export default PartnerController;