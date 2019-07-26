import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postAdminPage = (req: Request, res: Response, next: NextFunction) => {
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
            key: Joi.string().max(255).required(),
            titleEn: Joi.string().max(255).required(),
            titleRu: Joi.string().max(255).required(),
            textEn: Joi.string().max(2500).required(),
            textRu: Joi.string().max(2500).required(),
            isPublic: Joi.boolean().required(), 
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postAdminPage;