import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";
import i18n from "i18next";

const getUserById = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            id: Joi.number().min(1).required().options({language: LocalizationHelper.getValidationMessages()})
        }),
        bodySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default getUserById;