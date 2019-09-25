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
import TrancheHasReport from '../../exceptions/project/trancheHasReport';
import FaceReport from '../../models/faceReport';
import ProjectTrancheRepository from '../../repositories/projectTrancheRepository';

interface PostCreateReport extends Request
{
    project: Project,
    tranche: ProjectTranche
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        projectId: Joi.number().required(),
        dateFrom: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        dateTo: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        type: Joi.number().min(1).max(3).required(),
        activities: Joi.array().items(Joi.object().keys({
            id: Joi.number().allow(null).allow(''),
            title: Joi.string().max(255).required(),
            amountA: Joi.number().min(0).required(),
            amountB: Joi.number().min(0).required()
        }).pattern(/./, Joi.any()).required()),
        isCertify: Joi.boolean().allow(true).required(),
        analyticalDocId: Joi.string().max(255).required(),
        financialDocId: Joi.string().max(255).required(),
        justificationDocId: Joi.string().max(255).allow(null).allow('')
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as PostCreateReport;
    try {
        requestValidation.validate(req.body, (err: any, value: any) => {
            req.body = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // CHECK PROJECT
        const projectId = req.body.projectId;
        const project = await Project.findOne({
            where: { 
                id: projectId
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
        // check right partner
        if (project.partnerId !== req.user.partnerId) {
            throw new BadPermissions();
        }
        if (project.deadline < new Date(req.body.dateTo)) {
            throw new BadValidationException(400,119, i18n.t('badToDate'));
        }
        // get active project tranche
        const activeTranche = await ProjectTranche.findOne({
            where: {
                projectId: project.id,
                status: ProjectTranche.IN_PROGRESS_STATUS_KEY
            }
        });
        if (activeTranche === null) {
            throw new BadProjectStatus(400, 119, i18n.t('projectBadStatusError'), 'Project doesn\'t have in progress tranche');
        }
        req.tranche = activeTranche;
        // get tranche request
        const request = await FaceRequest.findOne({
            where: {
                trancheId: activeTranche.id
            }
        });
        if (request.statusId!==FaceRequest.SUCCESS_STATUS_KEY) {
            throw new BadProjectStatus(400, 119, i18n.t('projectBadStatusError'), 'Project has in progress request');
        }
        // get report
        const report = await FaceReport.findOne({
            where: {
                trancheId: activeTranche.id
            }
        });
        if (report) {
            throw new TrancheHasReport();
        }
        // check activities
        const activities: Array<{id: number|null; title: string; amountE: number; }> = req.body.activities;
        if (activities.length < 1) {
            throw new BadValidationException(400, 119, i18n.t('emptyActivitiesArray'));
        }
        let totalA = 0;
        let totalB = 0;
        for (var i=0; i < activities.length; i++) {
            const activity = activities[i];
                // get activity data
            const projectActivity = await ProjectActivity.findOne({
                where: {
                    projectId: project.id,
                    id: activity.id
                }
            })
            if (projectActivity === null) {
                throw new BadValidationException(400, 119, i18n.t('activityNotFind'));
            }
            totalA = totalA + parseInt(activity.amountA);
            totalB = totalB + parseInt(activity.amountB);
        }
        console.log('TATAL A!!!!', totalA + totalA*0.2);
        console.log('TATAL B!!!', totalB);
        console.log('TATAL     ASpdjaopsijd!!!', (totalA + totalA*0.2)<totalB);
        if ((totalA + totalA*0.2)<totalB) {
            // it should be justification document
            // check if its last tranche
            const isLastTranche = await ProjectTrancheRepository.getIsLastTranche(projectId);
            if (isLastTranche) {
                throw new BadValidationException(400, 119, i18n.t('badAmountBValue'));
            }
            if (req.body.justificationDocId == null || req.body.justificationDocId == '') {
                throw new BadValidationException(400, 119, i18n.t('justificationDocRequired'));
            }
        } else {
            req.body.justificationDocId = null;
        }

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

export { PostCreateReport, middleware };