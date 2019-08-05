import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import i18n from "i18next";
import BadValidationException from "../../exceptions/badValidationException";
import HttpException from "../../exceptions/httpException";
import ApiController from "../../controllers/apiController";

const postDocumentUploading = (req: Request, res: Response, next: NextFunction) => {
    const docMime = 'application/msword';
    const docxMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const pdfMime = 'application/pdf';
    const validateRules = Joi.object().options({
        abortEarly: true,
        language: {
            any: {
                valid: i18n.t('fileMimeValidation')
            },
            number: {
                max: i18n.t('fileSizeValidation')
            }
        }
    }).keys({
        size: Joi.number().max(5242880).required(),
        mimetype: Joi.string().valid(docMime, docxMime, pdfMime).required()
    }).pattern(/./, Joi.any());

    try {
        validateRules.validate(req.file, (err: any, value: any) => {
            if (err) {
                throw new BadValidationException(400, 129, err.message, 'Validation error');
            }
         })

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

export default postDocumentUploading;