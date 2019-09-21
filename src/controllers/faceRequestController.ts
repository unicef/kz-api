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
import { GetRequest } from "../requests/faceRequest/getRequest";
import event from "../services/event";
import FaceRequestCreated from "../events/faceRequestCreated";
import ProjectHelper from "../helpers/projectHelper";
import ProjectTranche from "../models/projectTranche";
import UserRepository from "../repositories/userRepository";
import { PostRequestApprove } from "../requests/faceRequest/postRequestApprove";
import FaceRequestChain from "../models/faceRequestChain";
import BadRole from "../exceptions/user/badRole";
import iInputActivity from "../interfaces/faceRequest/iInputActivity";

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
                    totalE: 0,
                    totalF: 0,
                    totalG: 0
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
            event(new FaceRequestCreated(req.user, request, project));
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

    static getRequest = async (req: GetRequest, res: Response, next: NextFunction) => {
        try { 
            const faceRequest = req.faceRequest;
            // get is my stage flag
            const isMyStage = FaceRequestHelper.isMyStage(faceRequest, req.user);
            return ApiController.success({request: faceRequest, isMyStage: isMyStage}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getNextStepUsers = async (req: GetRequest, res: Response, next: NextFunction) => {
        try {
            const users = await UserRepository.getForFaceList(req.user.id);

            const responseData = {
                users: users
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

    static approve = async (req: PostRequestApprove, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const tranche = req.tranche;
            const faceRequest = req.faceRequest;
            const activities = req.activities;

            console.log("PROJECT", typeof project);
            console.log("Number", typeof 24);

            // get approve chain
            const requestChain = await FaceRequestChain.findOne({
                where: {
                    requestId: faceRequest.id
                }
            });
            if (requestChain) {
                switch (null) {
                    case requestChain.confirmAt: {
                        // check userID
                        if (requestChain.confirmBy !== req.user.id) {
                            throw new BadRole();
                        }
                        // foreach all activities
                        let rejectRequest = false;
                        let rejectedActivities: Array<iInputActivity>|[] = [];
                        activities.forEach((activity) => {
                            if (activity.isRejected) {
                                rejectRequest = true;
                                rejectedActivities.push(activity);
                            }
                        })
                        if (rejectRequest) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {

                        }
                        return res.json("GOOD CHOISE");
                    }
                    break;
                    case requestChain.validateAt: {
                        return res.json("GOOD CHOISE2");
                    }
                    break;
                    case requestChain.certifyAt: {
                        return res.json("GOOD CHOISE3");
                    }
                    break;
                    case requestChain.approveAt: {
                        return res.json("GOOD CHOISE4");
                    }
                    break;
                    case requestChain.verifyAt: {
                        return res.json("GOOD CHOISE5");
                    }
                }
            }
            


            return ApiController.success({
                chain: requestChain,
                project: project,
                tranche: tranche,
                faceRequest: faceRequest,
                activities: activities
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
}

export default FaceRequestController;