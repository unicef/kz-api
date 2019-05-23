import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Translation from "../../models/translation";
import Joi from "@hapi/joi";
import i18n from "i18next";

/**
 * Class for get translation phrase validation
 */
const getAllTranslations = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            code: Joi.string().empty(['', null]).length(2, 'utf8').valid(Translation.langCodes).insensitive().default(Translation.defaultLang).options({language: {
                string: {
                    length: i18n.t('stringLengthValidation'),
                    base: i18n.t('stringBaseValidation'),
                },
                any: {
                    allowOnly: i18n.t('anyValidValidation')
                }
            }})
        }),
        bodySchema: null
    }
    

    validationProcess(req, res, next, validationRules);
}


export default getAllTranslations;