import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";
import i18n from "i18next";

const postProgress = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            id: Joi.number().required(),
            partner: Joi.object().keys({
                id: Joi.number().required(),
                name: Joi.string().max(255).required()
            }).pattern(/./, Joi.any()).required(),
            documents: Joi.array().min(3).items(
                Joi.object().keys({
                    title: Joi.string().max(255).required(),
                    id: Joi.string().max(255).required()
                }).pattern(/./, Joi.any())).required(),
            tranches: Joi.array().items(
                Joi.object().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).keys({
                    from: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
                    to: Joi.string().regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
                    amount: Joi.number().required()
                }).pattern(/./, Joi.any())).required()
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postProgress;