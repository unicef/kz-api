import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import FaceRequestHelper from "../helpers/faceRequestHelper";
import ActivityRepository from "../repositories/activityRepository";
import ProjectTrancheRepository from "../repositories/projectTrancheRepository";

class FaceRequestController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lang: string = i18n.language;
            const projectId: number = req.query.projectId;
            let faceRequestTypes = [...FaceRequestHelper.requestTypes];
            let responseTypes: Array<{id: number; title: string}>|[] = [];
            faceRequestTypes.forEach((type: {id:number, ru: string, en: string}) => {
                responseTypes.push({id: type.id, title: type[lang]});
            })

            // get activities
            const activities = await ActivityRepository.getByProjectId(projectId);
            // get tranche number
            const activeTranche = await ProjectTrancheRepository.findActiveNumByProjectId(projectId);
            

            return ApiController.success({type: responseTypes, activities: activities, num: activeTranche}, res);
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

export default FaceRequestController;