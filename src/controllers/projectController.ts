import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import ProgrammeRepository from "../repositories/programmeRepository";
import SettingHelper from "../helpers/settingHelper";
import SectionRepository from "../repositories/sectionRepository";
import UserRepository from "../repositories/userRepository";
import Role from "../models/role";

class ProjectController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let responseData: any = {};
            if (!req.query.key || req.query.key == 'programmes') {
                const programmes = await ProgrammeRepository.getTree();
                responseData['programmes'] = programmes;
            }
            if (!req.query.key || req.query.key == 'KZTRate') {
                const usdRate: number = SettingHelper.getUSDRate();
                responseData['usdRate'] = usdRate;
            }
            if (!req.query.key || req.query.key == 'sections') {
                const sections = await SectionRepository.findAll();
                responseData['sections'] = sections;
            }
            if (!req.query.key || req.query.key == 'officers') {
                const officers = await UserRepository.findByRole(Role.unicefResponsibleId);
                responseData['officers'] = officers;
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
}
export default ProjectController;