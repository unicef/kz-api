import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";

const putAdminDonor = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            id: Joi.number().required(),
            email: Joi.string().email({ minDomainSegments: 2 }).required(),
            firstNameEn: Joi.string().max(255).allow('').allow(null),
            firstNameRu: Joi.string().max(255).allow('').allow(null),
            lastNameEn: Joi.string().max(255).allow('').allow(null),
            lastNameRu: Joi.string().max(255).allow('').allow(null),
            occupationEn: Joi.string().max(512).allow('').allow(null),
            occupationRu: Joi.string().max(512).allow('').allow(null),
            companyEn: Joi.string().max(512).required(),
            companyRu: Joi.string().max(512).required(),
            tel: Joi.string().max(20).allow('').allow(null),
            mobile: Joi.string().max(20).allow('').allow(null)
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putAdminDonor;