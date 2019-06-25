import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const repeatActivationLink = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: {
                string: {
                    length: i18n.t('stringLengthValidation'),
                    min: i18n.t('stringMinValidation'),
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
            repeatHash: Joi.string().required()
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default repeatActivationLink;