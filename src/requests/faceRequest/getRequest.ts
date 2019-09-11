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
import RequestNotFound from '../../exceptions/project/requestNotFound';
import ProjectRepository from '../../repositories/projectRepository';
import FaceRequestRepository from '../../repositories/faceRequestRepository';

interface GetRequest extends Request
{
    faceRequest: any
}

const requestValidation = Joi.object().options({
    abortEarly: false,
    language: LocalizationHelper.getValidationMessages()
}).keys({
    id: Joi.number().min(1).required(),
}).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as GetRequest;
    try {
        requestValidation.validate(req.query, (err: any, value: any) => {
            req.query = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // check request
        const requestId = req.query.id;
        const request = await FaceRequestRepository.findById(requestId);

        if (request === null) {
            throw new RequestNotFound();
        }
        
        if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
            // get partnerId col from project and check partner
            if (request.partnerId !== req.user.partnerId) {
                throw new BadPermissions();
            }
        }
        req.faceRequest = request;
        
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


export { GetRequest, middleware };