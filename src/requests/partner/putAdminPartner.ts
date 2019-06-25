import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const putAdminPartner = (req: Request, res: Response, next: NextFunction) => {
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
            user: Joi.object().keys({
                id: Joi.number().required(),
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                firstNameEn: Joi.string().max(255).allow('').allow(null),
                firstNameRu: Joi.string().max(255).allow('').allow(null),
                lastNameEn: Joi.string().max(255).allow('').allow(null),
                lastNameRu: Joi.string().max(255).allow('').allow(null),
                occupationEn: Joi.string().max(512).allow('').allow(null),
                occupationRu: Joi.string().max(512).allow('').allow(null),
                tel: Joi.string().max(20).allow('').allow(null),
                mobile: Joi.string().max(20).allow('').allow(null),
                role: Joi.object().keys({
                    id: Joi.string().max(6),
                    title: Joi.string().max(255),
                }).pattern(/./, Joi.any()).required()
            }).pattern(/./, Joi.any()),
            company: Joi.object().keys({
                id: Joi.number().required(),
                nameEn: Joi.string().max(255).required(),
                nameRu: Joi.string().max(255).required(),
                tradeNameEn: Joi.string().max(255).allow('').allow(null),
                tradeNameRu: Joi.string().max(255).allow('').allow(null),
                license: Joi.string().max(255).allow('').allow(null),
                country: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }),
                ceoFirstNameEn: Joi.string().max(255).allow('').allow(null),
                ceoFirstNameRu: Joi.string().max(255).allow('').allow(null),
                ceoLastNameEn: Joi.string().max(255).allow('').allow(null),
                ceoLastNameRu: Joi.string().max(255).allow('').allow(null),
                establishmentYear: Joi.number().max(new Date().getFullYear()).allow(null),
                employersCount: Joi.number().allow(null),
                areaOfWork: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }),
                ownership: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }),
                partnerType: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }),
                csoType: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }).allow(null),
                tel: Joi.string().max(20).allow('').allow(null),
                website: Joi.string().max(124).allow('').allow(null),
                cityEn: Joi.string().max(255).allow('').allow(null),
                cityRu: Joi.string().max(255).allow('').allow(null),
                addressEn: Joi.string().max(255).allow('').allow(null),
                addressRu: Joi.string().max(255).allow('').allow(null),
                zip: Joi.string().max(20).allow('').allow(null),
            }).pattern(/./, Joi.any()),
            documents: Joi.array().items(Joi.object().keys({
                title: Joi.string().max(255),
                id: Joi.string().max(255)
            }).pattern(/./, Joi.any()))
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default putAdminPartner;