import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

/**
 * Class for get translation phrase validation
 */
const getPhraseValidate = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            key: Joi.string().min(3).required().options({language: {
                string: {
                    min: i18n.t('stringMinValidation'),
                    base: i18n.t('stringBaseValidation'),
                },
                any: {
                    required: i18n.t('anyRequiredValidation'),
                    empty: i18n.t('anyEmptyValidation'),
                    unknown: i18n.t('anyUnknownValidation')
                }
            }})
        }),
        bodySchema: null
    }

    validationProcess(req, res, next, validationRules);
}

export default getPhraseValidate;