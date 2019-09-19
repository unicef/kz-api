import { Request, Response, NextFunction } from 'express';
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";
import Project from '../../models/project';
import ProjectTranche from '../../models/projectTranche';
import BadValidationException from '../../exceptions/badValidationException';
import getValidationErrorMessage from '../../helpers/getValidationErrorMessage';
import ApiController from '../../controllers/apiController';
import HttpException from '../../exceptions/httpException';
import ProjectNotFound from '../../exceptions/project/projectNotFound';
import BadProjectStatus from '../../exceptions/project/badProjectStatus';
import BadPermissions from '../../exceptions/badPermissions';
import FaceRequestRepository from '../../repositories/faceRequestRepository';
import FaceRequest from '../../models/faceRequest';
import TrancheHasRequest from '../../exceptions/project/trancheHasRequest';
import FaceRequestHelper from '../../helpers/faceRequestHelper';
import ProjectActivity from '../../models/projectActivity';
import RequestNotFound from '../../exceptions/project/requestNotFound';
import BadTrancheStatus from '../../exceptions/project/badTrancheStatus';

interface PostRequestApprove extends Request
{
    project: Project,
    tranche: ProjectTranche,
    faceRequest: FaceRequest,
    activities: Array<ProjectActivity>
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        requestId: Joi.number().min(1).required(),
        activities: Joi.array().items(Joi.object().keys({
            id: Joi.number().allow(null).allow(''),
            title: Joi.string().max(255).required(),
            amountE: Joi.number().min(0).required(),
            amountF: Joi.number().min(0).required(),
            amountG: Joi.number().min(0).required(),
            isRejected: Joi.boolean().required(),
            rejectReason: Joi.string().allow('').required()
        }).pattern(/./, Joi.any()).required()),
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as PostRequestApprove;
    try {
        requestValidation.validate(req.body, (err: any, value: any) => {
            req.body = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // CHECK Face Request
        const requestId = req.body.requestId;
        const faceRequest = await FaceRequest.findOne({
            where: {
                id: requestId
            }
        });
        if (faceRequest===null) {
            throw new RequestNotFound();
        }
        // check user role + face request stage
        switch (faceRequest.statusId) {
            case FaceRequest.WAITING_STATUS_KEY: {

            }
            break;
        }
        // Check project tranche
        const tranche = await ProjectTranche.findOne({
            where: {
                id: faceRequest.trancheId
            }
        });
        if (tranche == null) {
            throw new Error('Tranche not found');
        }
        if (tranche.status!==ProjectTranche.IN_PROGRESS_STATUS_KEY) {
            throw new BadTrancheStatus();
        }
        // Check project
        const project = await Project.findOne({
            where: { 
                id: tranche.projectId
            }
        });

        if (project === null) {
            throw new ProjectNotFound();
        }
        req.project = project;
        // check project status
        if (project.statusId !== Project.IN_PROGRESS_STATUS_ID) {
            throw new BadProjectStatus();
        }
        
        // check activities
        const activities: Array<{id: number|null; title: string; amountE: number; }> = req.body.activities;
        if (activities.length < 1) {
            throw new BadValidationException(400, 119, i18n.t('emptyActivitiesArray'));
        }
        req.activities = [];
        for (var i=0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.id === null || activity.id === '') {
                throw new BadValidationException(400, 119, i18n.t('notFoundActivity'));
            }
            const projectActivity = await ProjectActivity.findOne({
                where: {
                    projectId: project.id,
                    id: activity.id
                }
            })
            if (projectActivity === null) {
                throw new BadValidationException(400, 119, i18n.t('activityNotFind'));
            }
            req.activities.push(projectActivity);
        }
        req.faceRequest = faceRequest;
        req.tranche = tranche;
        req.project = project;

        next();
    } catch (error) {
        if (error instanceof HttpException) {
            error.response(res);
        } else {
            ApiController.failed(500, error.message, res);
        }
        return ;
    }
}

export { PostRequestApprove, middleware };