import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const getPartnerById = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            id: Joi.number().min(1).required().options({language: {
                number: {
                    min: i18n.t('numberMinValidation'),
                    base: i18n.t('numberBaseValidation'),
                },
                any: {
                    required: i18n.t('anyRequiredValidation'),
                    empty: i18n.t('anyEmptyValidation'),
                    unknown: i18n.t('anyUnknownValidation')
                }
            }})
        }),
        bodySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default getPartnerById;