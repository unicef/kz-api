import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";
import LocalizationHelper from "../../helpers/localizationHelper";

const postForgotPassword = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({ 
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required()
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postForgotPassword;