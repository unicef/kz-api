import { Request, Response } from "express";
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
}

export default PartnerController;