import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const postActivationProcess = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: null,
        bodySchema: Joi.object().options({ 
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            hash: Joi.string().min(30).required()
        })
    }

    validationProcess(req, res, next, validationRules);
}

export default postActivationProcess;