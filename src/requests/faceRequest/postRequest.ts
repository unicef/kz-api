import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";
import i18n from "i18next";

const postRequest = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            projectId: Joi.number().required(),
            from: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
            to: Joi.string().options({language: {string: {regex : {base: i18n.t('dateFormatValidation')}}}}).regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).required(),
            typeId: Joi.number().min(1).max(3).required(),
            activities: Joi.object().keys({
                id: Joi.allow(null).allow('').number(),
                title: Joi.string().max(255).required(),
                amountE: Joi.number().min(0).required()
            }).pattern(/./, Joi.any()).required(),
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postRequest;