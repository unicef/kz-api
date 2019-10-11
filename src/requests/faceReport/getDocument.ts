import { Request, Response, NextFunction } from 'express';
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";
import BadValidationException from '../../exceptions/badValidationException';
import getValidationErrorMessage from '../../helpers/getValidationErrorMessage';
import ApiController from '../../controllers/apiController';
import HttpException from '../../exceptions/httpException';
import BadPermissions from '../../exceptions/badPermissions';
import FaceReportRepository from '../../repositories/faceReportRepository';
import ReportNotFound from '../../exceptions/project/reportNotFound';
import FaceReportDocument from '../../models/faceReportDocument';
import TmpFileNotFound from '../../exceptions/tmpFileNotFound';
import FaceReport from '../../models/faceReport';
import sequelize from 'sequelize';
import Role from '../../models/role';

interface GetDocument extends Request
{
    faceReportDocument: FaceReportDocument;
}

const requestValidation = Joi.object().options({
    abortEarly: false,
    language: LocalizationHelper.getValidationMessages()
}).keys({
    id: Joi.number().min(1).required()
}).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as GetDocument;
    try {
        requestValidation.validate(req.query, (err: any, value: any) => {
            req.query = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // get document
        const reportDocument = await FaceReportDocument.findOne({
            where: {
                id: req.query.id
            }
        });
        if (reportDocument === null) {
            throw new TmpFileNotFound(404, 124, i18n.t('reportFileNotFound'), 'Report file not found');
        }
        const Op = sequelize.Op;
        const faceReport = await FaceReport.findOne({
            where: {
                [Op.or]: [{analyticalDocId: req.query.id}, {financialDocId: req.query.id}, {justificationDocId: req.query.id}]
            }
        });
        if (faceReport === null) {
            throw new ReportNotFound();
        }
        if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
            const reportPartnerId = await faceReport.getPartnerId();
            if (reportPartnerId !== req.user.partnerId) {
                throw new BadPermissions();
            }
        }
        req.faceReportDocument = reportDocument;
        
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


export { GetDocument, middleware };