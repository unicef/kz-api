import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";

/**
 * Class for get translation phrase validation
 */
const getPhraseValidate = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            key: Joi.string().min(3).required().options({language: LocalizationHelper.getValidationMessages()})
        }),
        bodySchema: null
    }

    validationProcess(req, res, next, validationRules);
}

export default getPhraseValidate;