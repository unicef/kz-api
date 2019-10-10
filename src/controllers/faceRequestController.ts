import { Request, Response, NextFunction } from "express";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import FaceRequestHelper from "../helpers/faceRequestHelper";
import ActivityRepository from "../repositories/activityRepository";
import { PostCreateRequest } from "../requests/faceRequest/postCreateRequest";
import { GetRequestActivitiesRequest } from "../requests/faceRequest/getRequestActivitiesRequest";
import FaceRequest from "../models/faceRequest";
import ProjectActivity from "../models/projectActivity";
import FaceRequestActivity from "../models/faceRequestActivity";
import { GetRequest } from "../requests/faceRequest/getRequest";
import event from "../services/event";
import FaceRequestCreated from "../events/faceRequestCreated";
import UserRepository from "../repositories/userRepository";
import { PostRequestApprove } from "../requests/faceRequest/postRequestApprove";
import FaceRequestChain from "../models/faceRequestChain";
import BadRole from "../exceptions/user/badRole";
import { PutUpdateRequest } from "../requests/faceRequest/putUpdateRequest";
import FaceRequestUpdated from "../events/faceRequestUpdated";
import User from "../models/user";
import BadValidationException from "../exceptions/badValidationException";
import i18n from "i18next";
import RequestBadStatus from "../exceptions/project/requestBadStatus";
import exceptionHandler from "../services/exceptionHandler";

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
            return exceptionHandler(error, res);
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
            return exceptionHandler(error, res);
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
            return exceptionHandler(error, res);
        }
    }

    static update = async (req: PutUpdateRequest, res: Response, next: NextFunction) => {
        try{
            const project = req.project;
            const tranche = req.tranche;
            const faceRequest = req.faceRequest;

            const faceRequestData = FaceRequestHelper.getRequestData(req.body);
            const updateFaceRequest = await faceRequest.update(faceRequestData);

            // working with activities
            const activities = req.body.activities;
            for (var i=0; i<activities.length; i++) {
                const activity = activities[i];
                if (activities[i].id === '' || activities[i].id === null) {
                    // insert new activity
                    const projectActivityData = {
                        projectId: project.id,
                        title: activity.title
                    }
                    const projectActivity = await ProjectActivity.create(projectActivityData);
                    // set request activity
                    await FaceRequestActivity.create({
                        requestId: faceRequest.id,
                        activityId: projectActivity.id,
                        amountE: activity.amountE
                    });
                } else {
                    const requestActivity = await FaceRequestActivity.findOne({
                        where: {
                            id: activity.id
                        }
                    });
                    // get project activity object
                    const projectActivity = await ProjectActivity.findOne({
                        where: {
                            id: requestActivity.activityId
                        }
                    });

                    // updating process
                    await requestActivity.update({
                        amountE: activity.amountE,
                        amountF: 0,
                        amountG: 0,
                        isRejected: false,
                        rejectReason: null
                    });
                    await projectActivity.update({title: activity.title});
                }   
            }

            faceRequest.statusId = FaceRequest.CONFIRM_STATUS_KEY;
            await faceRequest.save();
            event(new FaceRequestUpdated(req.user, faceRequest, project));

            const responseData = {
                message: i18n.t('faceRequestSuccessfullyEdited')
            };
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getRequest = async (req: GetRequest, res: Response, next: NextFunction) => {
        try { 
            const faceRequest = req.faceRequest;
            // get is my stage flag
            const isMyStage = await FaceRequestHelper.isMyStage(faceRequest, req.user);
            return ApiController.success({request: faceRequest, isMyStage: isMyStage}, res);
        } catch (error) {
            return exceptionHandler(error, res);
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
            return exceptionHandler(error, res);
        }
    }

    static approve = async (req: PostRequestApprove, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const tranche = req.tranche;
            const faceRequest = req.faceRequest;
            const activities = req.activities;

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
                        if (faceRequest.statusId !== FaceRequest.CONFIRM_STATUS_KEY) {
                            throw new RequestBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceRequestHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {
                            await FaceRequestHelper.confirmRequestProcess(req.user, activities, faceRequest, tranche, project, requestChain);
                        }
                    }
                    break;
                    case requestChain.validateAt: {
                        // approve by project coordinator
                        // check userID
                        if (requestChain.validateBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceRequest.statusId !== FaceRequest.VALIDATE_STATUS_KEY) {
                            throw new RequestBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceRequestHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceRequestHelper.isNextUserAttachedtoChain(faceRequest.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceRequestHelper.validateRequestProcess(req.user, activities, faceRequest, tranche, project, requestChain, nextUser);
                        }
                    }
                    break;
                    case requestChain.certifyAt: {
                        // approve by project coordinator
                        // check userID
                        if (requestChain.certifyBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceRequest.statusId !== FaceRequest.CERTIFY_STATUS_KEY) {
                            throw new RequestBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceRequestHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceRequestHelper.isNextUserAttachedtoChain(faceRequest.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceRequestHelper.certifyRequestProcess(req.user, activities, faceRequest, tranche, project, requestChain, nextUser);
                        }
                    }
                    break;
                    case requestChain.approveAt: {
                        // approve by project coordinator
                        // check userID
                        if (requestChain.approveBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceRequest.statusId !== FaceRequest.APPROVE_STATUS_KEY) {
                            throw new RequestBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceRequestHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceRequestHelper.isNextUserAttachedtoChain(faceRequest.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceRequestHelper.approveRequestProcess(req.user, activities, faceRequest, tranche, project, requestChain, nextUser);
                        }
                    }
                    break;
                    case requestChain.verifyAt: {
                        // approve by project coordinator
                        // check userID
                        if (requestChain.verifyBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceRequest.statusId !== FaceRequest.VERIFY_STATUS_KEY) {
                            throw new RequestBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceRequestHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceRequestHelper.rejectRequestProcess(req.user, faceRequest, project, rejectedActivities, requestChain); 
                        } else {
                            await FaceRequestHelper.verifyRequestProcess(req.user, activities, faceRequest, tranche, project, requestChain);
                        }
                        
                    }
                }
            }
            
            return ApiController.success({
                message: i18n.t('successApprovingMessage')
            }, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default FaceRequestController;