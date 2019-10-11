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
import FaceRequest from '../../models/faceRequest';
import Role from '../../models/role';
import ProjectHasNoActiveTranche from '../../exceptions/project/projectHasNoActiveTranche';
import ProjectRepository from '../../repositories/projectRepository';
import RequestNotFound from '../../exceptions/project/requestNotFound';
import FaceReport from '../../models/faceReport';
import TrancheHasReport from '../../exceptions/project/trancheHasReport';
import ReportNotFound from '../../exceptions/project/reportNotFound';

interface GetReportActivitiesRequest extends Request
{
    project: Project,
    tranche: ProjectTranche,
    faceReport: FaceReport,
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        reportId: Joi.number().allow('').required(),
        projectId: Joi.number().min(1).required(),
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as GetReportActivitiesRequest;
    try {
        requestValidation.validate(req.query, (err: any, value: any) => {
            req.query = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // CHECK PROJECT
        const projectId = req.query.projectId;
        const project = await Project.findOne({
            where: { 
                id: projectId
            }
        });
        if (project === null) {
            throw new ProjectNotFound();
        }
        req.project = project;

        // CHECK USER ROLE AND ACCESS TO PROJECT
        if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
            if (project.partnerId !== req.user.partnerId) {
                throw new BadPermissions();
            }
        }
        let faceReport = null;
        if (req.query.reportId === '' || req.query.reportId === null) {
            // IF NEW REPORT
            // check project status
            if (project.statusId !== Project.IN_PROGRESS_STATUS_ID) {
                throw new BadProjectStatus();
            }
            // check active tranche
            const activeTranche = await ProjectTranche.findOne({
                where: {
                    projectId: project.id,
                    status: ProjectTranche.IN_PROGRESS_STATUS_KEY
                }
            });
            if (activeTranche === null) {
                throw new ProjectHasNoActiveTranche();
            }
            req.tranche = activeTranche;
            const faceRequest = await FaceRequest.findOne({
                where: {
                    trancheId: activeTranche.id
                }
            });
            if (faceRequest === null  || faceRequest.statusId!==FaceRequest.SUCCESS_STATUS_KEY) {
                throw new ReportNotFound();
            }
            // check exists report in active tranche
            faceReport = await FaceReport.findOne({
                where: {
                    trancheId: activeTranche.id
                }
            });
            if (faceReport !== null) {
                throw new TrancheHasReport()
            }
        } else {
            // IF EXISTS REPORT
            faceReport = await FaceReport.findOne({
                where: {
                    id: req.query.reportId
                }
            });
            if (faceReport === null) {
                throw new ReportNotFound()
            }
            // get project id for request
            const partnerIdByTranche = await ProjectRepository.getPartnerIdByTrancheId(faceReport.trancheId);
            if (partnerIdByTranche !== project.partnerId) {
                throw new ReportNotFound();
            }
            const tranche = await ProjectTranche.findOne({
                where: {
                    id: faceReport.trancheId
                }
            });
            req.tranche = tranche;
            req.faceReport = faceReport;
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

export { GetReportActivitiesRequest, middleware };