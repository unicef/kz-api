import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const patchProjectTermination = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            id: Joi.number().required()
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default patchProjectTermination;