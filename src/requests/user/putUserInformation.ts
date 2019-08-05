import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";
import LocalizationHelper from "../../helpers/localizationHelper";

const putUserInformation = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            firstNameEn: Joi.string().max(255).required(),
            firstNameRu: Joi.string().max(255).required(),
            lastNameEn: Joi.string().max(255).required(),
            lastNameRu: Joi.string().max(255).required(),
            occupationEn: Joi.string().max(512).required(),
            occupationRu: Joi.string().max(512).required(),
            tel: Joi.string().max(20).allow('').allow(null),
            mobile: Joi.string().max(20).required(),
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putUserInformation;