import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";

const getPartnerDocuments = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        querySchema: Joi.object().options({ abortEarly: false}).keys({
            id: Joi.number().min(1).required().options({language: LocalizationHelper.getValidationMessages()})
        }).pattern(/./, Joi.any()),
        bodySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default getPartnerDocuments;