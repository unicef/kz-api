import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import FaceRequestHelper from "../helpers/faceRequestHelper";
import ActivityRepository from "../repositories/activityRepository";
import ProjectTrancheRepository from "../repositories/projectTrancheRepository";
import Project from "../models/project";
import { PostCreateRequest } from "../requests/faceRequest/postCreateRequest";
import { GetRequestActivitiesRequest } from "../requests/faceRequest/getRequestActivitiesRequest";
import FaceRequest from "../models/faceRequest";
import ProjectActivity from "../models/projectActivity";
import FaceRequestActivity from "../models/faceRequestActivity";

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

            return ApiController.success({type: responseTypes}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getActivities = async (req: GetRequestActivitiesRequest, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const request = req.faceRequest;
            let activities;
            let totalActivities;

            if (request==null) {
                // get project activities 
                activities = await ActivityRepository.getByProjectId(project.id);
                totalActivities = {
                    amountE: 0,
                    amountF: 0,
                    amountG: 0
                };
            } else {
                // get request activities
                activities = await ActivityRepository.getByRequestId(request.id);
                totalActivities = await ActivityRepository.getTotalRequestAmounts(request.id);
            }
            const responseData = {
                activities: activities,
                total: totalActivities
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

    static create = async (req: PostCreateRequest, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const tranche = req.tranche;

            // prepare request data
            const requestData = FaceRequestHelper.getRequestData(req.body);
            const activities = req.body.activities;

            requestData.trancheId = tranche.id;
            requestData.statusId = FaceRequest.CONFIRM_STATUS_KEY;

            const request = await FaceRequest.create(requestData);
            // working with activities
            for (var i=0; i<activities.length; i++) {
                const activity = activities[i];
                let projectActivity = null;
                if (activity.id == '' || activity.id == null) {
                    // create new project activity
                    const projectActivityData = {
                        projectId: project.id,
                        title: activity.title
                    }
                    projectActivity = await ProjectActivity.create(projectActivityData);
                } else {
                    // get exists activity
                    projectActivity = await ProjectActivity.findOne({
                        where: {
                            id: activity.id
                        }
                    })
                }
                // set request activity
                await FaceRequestActivity.create({
                    requestId: request.id,
                    activityId: projectActivity.id,
                    amountE: activity.amountE
                });
            }
            
            const responseData = {
                message: i18n.t('faceRequestCreatedSuccesfully')
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

export default FaceRequestController;