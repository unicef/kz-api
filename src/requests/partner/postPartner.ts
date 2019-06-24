import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postPartner = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: {
                string: {
                    length: i18n.t('stringLengthValidation'),
                    min: i18n.t('stringMinValidation'),
                    max: i18n.t('stringMaxValidation'),
                    base: i18n.t('stringBaseValidation'),
                    email: i18n.t('stringEmailValidation'),
                    regex: {
                        base: i18n.t('stringRegexPasswordValidation')
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
            nameEn: Joi.string().max(255).required(),
            nameRu: Joi.string().max(255).required(),
            tradeNameEn: Joi.string().max(255).required(),
            tradeNameRu: Joi.string().max(255).required(),
            license: Joi.string().max(255).required(),
            countryId: Joi.number().required(),
            ceoFirstNameEn: Joi.string().max(255).required(),
            ceoFirstNameRu: Joi.string().max(255).required(),
            ceoLastNameEn: Joi.string().max(255).required(),
            ceoLastNameRu: Joi.string().max(255).required(),
            establishmentYear: Joi.number().max(new Date().getFullYear()).required(),
            employersCount: Joi.number().required(),
            areaOfWorkId: Joi.number().required(),
            ownershipId: Joi.number().required(),
            partnerTypeId: Joi.number().required(),
            csoTypeId: Joi.number(),
            tel: Joi.string().max(20).required(),
            website: Joi.string().max(124).required(),
            cityEn: Joi.string().max(255).required(),
            cityRu: Joi.string().max(255).required(),
            addressEn: Joi.string().max(255).required(),
            addressRu: Joi.string().max(255).required(),
            zip: Joi.string().max(20).required(),
            authorised: Joi.object().keys({
                email: Joi.string().email({ minDomainSegments: 2 }),
                firstNameEn: Joi.string().max(255).required(),
                firstNameRu: Joi.string().max(255).required(),
                lastNameEn: Joi.string().max(255).required(),
                lastNameRu: Joi.string().max(255).required(),
                occupationEn: Joi.string().max(512).required(),
                occupationRu: Joi.string().max(512).required(),
            })
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postPartner;