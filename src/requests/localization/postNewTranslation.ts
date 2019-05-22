import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import config from "../../config/config";
import Joi from "@hapi/joi";

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

    validationRules.bodySchema = Joi.object(validationBodyRules);
    validationProcess(req, res, next, validationRules);
}

export default postNewTranslation;