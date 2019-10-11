import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postAdminPage = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            key: Joi.string().max(255).required(),
            titleEn: Joi.string().max(255).required(),
            titleRu: Joi.string().max(255).required(),
            textEn: Joi.string().required(),
            textRu: Joi.string().required(),
            isPublic: Joi.boolean().required(), 
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postAdminPage;