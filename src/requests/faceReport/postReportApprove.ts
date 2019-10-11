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
import Role from '../../models/role';
import ActivityRepository from '../../repositories/activityRepository';
import iInputActivity from '../../interfaces/faceRequest/iInputActivity';
import RequestBadStatus from '../../exceptions/project/requestBadStatus';
import FaceRequestActivity from '../../models/faceRequestActivity';
import FaceReport from '../../models/faceReport';
import ReportNotFound from '../../exceptions/project/reportNotFound';
import iInputReportActivity from '../../interfaces/faceReport/iInputReportActivity';

interface PostReportApprove extends Request
{
    project: Project,
    tranche: ProjectTranche,
    faceReport: FaceReport,
    activities: Array<iInputReportActivity>
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        id: Joi.number().min(1).required(),
        activities: Joi.array().items(Joi.object().keys({
            id: Joi.number().allow(null).allow(''),
            title: Joi.string().max(255).required(),
            amountA: Joi.number().min(0).required(),
            amountB: Joi.number().min(0).required(),
            amountC: Joi.number().min(0).allow(null),
            amountD: Joi.number().allow(null),
            isRejected: Joi.boolean().required(),
            rejectReason: Joi.string().allow('').required()
        }).pattern(/./, Joi.any()).required()),
        nextUser: Joi.number().min(1).allow(null).allow('').required()
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as PostReportApprove;
    try {
        requestValidation.validate(req.body, (err: any, value: any) => {
            req.body = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        
        // CHECK Face Request
        const reportId = req.body.id;
        const faceReport = await FaceReport.findOne({
            where: {
                id: reportId
            }
        });
        if (faceReport===null) {
            throw new ReportNotFound();
        }
        // face report stage
        const isRepWaiting = faceReport.statusId == FaceReport.WAITING_STATUS_KEY;
        const isRepSuccess = faceReport.statusId == FaceReport.SUCCESS_STATUS_KEY;
        const isRepReject = faceReport.statusId == FaceReport.REJECT_STATUS_KEY;
        if (isRepWaiting || isRepSuccess || isRepReject) {
            throw new RequestBadStatus();
        }
        // Check project tranche
        const tranche = await ProjectTranche.findOne({
            where: {
                id: faceReport.trancheId
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
        const activities: Array<iInputReportActivity> = req.body.activities;
        if (activities.length < 1) {
            throw new BadValidationException(400, 119, i18n.t('emptyActivitiesArray'));
        }
        req.activities = [];
        for (var i=0; i < activities.length; i++) {
            const activity = activities[i];
            if (activity.id === null || activity.id === '') {
                throw new BadValidationException(400, 119, i18n.t('notFoundActivity'));
            }
            const projectActivity = await ActivityRepository.findReportActivityById(activity.id);
            if (projectActivity === null) {
                throw new BadValidationException(400, 119, i18n.t('activityNotFind'));
            }
            // get activityId param
            activity.activityId = projectActivity.activityId;
            req.activities.push(activity);
        }
        req.faceReport = faceReport;
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

export { PostReportApprove, middleware };