import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const putUnicefUser = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: {
                string: {
                    length: i18n.t('stringLengthValidation'),
                    min: i18n.t('stringMinValidation'),
                    max: i18n.t('stringMaxValidation'),
                    base: i18n.t('stringBaseValidation'),
                    email: i18n.t('stringEmailValidation'),
                    regex: {
                        base: i18n.t('stringRegexPasswordValidation')
                    }
                },
                any: {
                    required: i18n.t('anyRequiredValidation'),
                    empty: i18n.t('anyEmptyValidation'),
                    unknown: i18n.t('anyUnknownValidation'),
                    allowOnly: i18n.t('anyValidValidation')
                }
            }
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