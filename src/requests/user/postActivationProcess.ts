import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postActivationProcess = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: null,
        bodySchema: Joi.object().options({ 
            abortEarly: false,
            language: {
                string: {
                    min: i18n.t('stringMinValidation'),
                    base: i18n.t('stringBaseValidation'),
                },
                any: {
                    required: i18n.t('anyRequiredValidation'),
                    empty: i18n.t('anyEmptyValidation'),
                    unknown: i18n.t('anyUnknownValidation')
                }
            }
        }).keys({
            hash: Joi.string().min(30).required()
        })
    }

    validationProcess(req, res, next, validationRules);
}

export default postActivationProcess;