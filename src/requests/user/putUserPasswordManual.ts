import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";
import LocalizationHelper from "../../helpers/localizationHelper";

const putUserPasswordManual = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            hash: Joi.string().min(30).required(),
            password: Joi.string().min(10).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*~^()_+`\-={}\[\]:;<>\\\/?])[A-Za-z\d#$@!%&*~^()_+`\-={}\[\]:;<>.\\\/?]{10,}$/),
            passwordConfirmation: Joi.string().required().valid(Joi.ref('password'))
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putUserPasswordManual;

