import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";
import i18n from "i18next";

const putUnicefUser = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            user: Joi.object().keys({
                id: Joi.number().required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                firstNameEn: Joi.string().max(255).allow('').allow(null),
                firstNameRu: Joi.string().max(255).allow('').allow(null),
                lastNameEn: Joi.string().max(255).allow('').allow(null),
                lastNameRu: Joi.string().max(255).allow('').allow(null),
                occupationEn: Joi.string().max(512).allow('').allow(null),
                occupationRu: Joi.string().max(512).allow('').allow(null),
                tel: Joi.string().max(20).allow('').allow(null),
                mobile: Joi.string().max(20).allow('').allow(null),
                role: Joi.object().keys({
                    id: Joi.string().max(6),
                    title: Joi.string().max(255),
                }).pattern(/./, Joi.any()).required()
            }).pattern(/./, Joi.any())
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putUnicefUser;