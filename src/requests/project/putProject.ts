import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const putProject = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            id: Joi.number().required(),
            titleEn: Joi.string().max(255).required(),
            titleRu: Joi.string().max(255).required(),
            programme: Joi.object().keys({
                id: Joi.number().allow(null),
                title: Joi.string().max(255).allow(null),
                code: Joi.string().max(255).allow(null),
            }).pattern(/./, Joi.any()).required(),
            deadline: Joi.string().max(25).required(),
            ice: Joi.number().required(),
            usdRate: Joi.number().required(),
            officer: Joi.object().keys({
                id: Joi.number().allow(null),
                name: Joi.string().max(255).allow(null),
            }).allow(null),
            section: Joi.object().keys({
                id: Joi.number().allow(null),
                title: Joi.string().max(255).allow(null),
            }).required(),
            descriptionEn: Joi.string().required(),
            descriptionRu: Joi.string().required(),
            documents: Joi.array().items(
                Joi.object().keys({
                    title: Joi.string().max(255),
                    id: Joi.string().max(255)
                }).pattern(/./, Joi.any())
            ).allow(null)
        }).pattern(/./, Joi.any()),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putProject;