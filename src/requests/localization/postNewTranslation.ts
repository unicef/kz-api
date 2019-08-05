import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import config from "../../config/config";
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postNewTranslation = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: null,
        querySchema: null
    };

    let validationBodyRules: any = {
        key: Joi.string().min(3).required()
    }

    const locales = config.locales;
    for (let key in locales) {
        validationBodyRules[key] = Joi.string().min(1).required();
    }

    validationRules.bodySchema = Joi.object(validationBodyRules).options({ 
        abortEarly: false, 
        language: LocalizationHelper.getValidationMessages()
    });
    validationProcess(req, res, next, validationRules);
}

export default postNewTranslation;