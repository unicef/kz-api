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

interface TestRequest extends Request
{
    project: Project,
    tranche: ProjectTranche,
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        projectId: Joi.number().required(),
        from: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        to: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
        typeId: Joi.number().min(1).max(3).required(),
        activities: Joi.array().items(Joi.object().keys({
            id: Joi.number().allow(null).allow(''),
            title: Joi.string().max(255).required(),
            amountE: Joi.number().min(0).required()
        }).pattern(/./, Joi.any()).required()),
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as TestRequest;
    try {
        requestValidation.validate(req.body, (err: any, value: any) => {
            req.body = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
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
        // get active project tranche
        const activeTranche = await ProjectTranche.findOne({
            where: {
                projectId: project.id,
                status: ProjectTranche.IN_PROGRESS_STATUS_KEY
            }
        });
        if (activeTranche === null) {
            throw new Error('Project doesn\'t have in progress tranche');
        }
        req.tranche = activeTranche;
        // get tranche request
        const request = await FaceRequestRepository.findByTrancheId(activeTranche.id);
        if (request) {
            throw new Error(`Tranche #${activeTranche.num} allready has request`);
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

export { TestRequest, middleware };