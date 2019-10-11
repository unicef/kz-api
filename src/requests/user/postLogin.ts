import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";
import LocalizationHelper from "../../helpers/localizationHelper";

const postLogin = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: true,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            email: Joi.string().email({ minDomainSegments: 2 }),
            password: Joi.string().min(10).options({language:{string: {min: i18n.t('badEmailOrPass'),regex: {base: i18n.t('badEmailOrPass')}}}}).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*~^()_+`\-={}\[\]:;<>\\\/?])[A-Za-z\d#$@!%&*~^()_+`\-={}\[\]:;<>.\\\/?]{10,}$/),
            "g-recaptcha-response": Joi.string().required()
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postLogin;