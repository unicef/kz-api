import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postLogin = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: {
                string: {
                    length: i18n.t('stringLengthValidation'),
                    min: i18n.t('badEmailOrPassword'),
                    base: i18n.t('badEmailOrPassword'),
                    email: i18n.t('badEmailOrPassword'),
                    regex: {
                        base: i18n.t('badEmailOrPassword')
                    }
                },
                any: {
                    required: i18n.t('anyRequiredValidation'),
                    empty: i18n.t('anyEmptyValidation'),
                    unknown: i18n.t('anyUnknownValidation'),
                    allowOnly: i18n.t('anyValidValidation')
                }
            }
        }).keys({
            email: Joi.string().email({ minDomainSegments: 2 }),
            password: Joi.string().min(10).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*~^()_+`\-={}\[\]:;<>\\\/?])[A-Za-z\d#$@!%&*~^()_+`\-={}\[\]:;<>.\\\/?]{10,}$/),
            "g-recaptcha-response": Joi.string().required()
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postLogin;