import { Request, Response, NextFunction } from 'express';
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import BadValidationException from '../../exceptions/badValidationException';
import getValidationErrorMessage from '../../helpers/getValidationErrorMessage';
import ApiController from '../../controllers/apiController';
import HttpException from '../../exceptions/httpException';
import BadPermissions from '../../exceptions/badPermissions';
import Role from '../../models/role';
import FaceReportRepository from '../../repositories/faceReportRepository';
import ReportNotFound from '../../exceptions/project/reportNotFound';

interface GetReport extends Request
{
    faceReport: any
}

const requestValidation = Joi.object().options({
    abortEarly: false,
    language: LocalizationHelper.getValidationMessages()
}).keys({
    id: Joi.number().min(1).required(),
}).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as GetReport;
    try {
        requestValidation.validate(req.query, (err: any, value: any) => {
            req.query = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // check report
        const reportId = req.query.id;
        const report = await FaceReportRepository.findById(reportId);

        if (report === null) {
            throw new ReportNotFound();
        }
        
        if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
            // get partnerId col from project and check partner
            if (report.partnerId !== req.user.partnerId) {
                throw new BadPermissions();
            }
        }
        req.faceReport = report;
        
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


export { GetReport, middleware };