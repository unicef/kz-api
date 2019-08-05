import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const postPartnerDocuments = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            documents: Joi.array().items(
                Joi.object().keys({
                    title: Joi.string().max(255),
                    id: Joi.string().max(255)
                }).pattern(/./, Joi.any())
            )
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postPartnerDocuments;