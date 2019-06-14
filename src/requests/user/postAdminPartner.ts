import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";

const postAdminPartner = (req: Request, res: Response, next: NextFunction) => {
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
                email: Joi.string().email({ minDomainSegments: 2 }).required(),
                firstNameEn: Joi.string().max(255),
                firstNameRu: Joi.string().max(255),
                lastNameEn: Joi.string().max(255),
                lastNameRu: Joi.string().max(255),
                occupationEn: Joi.string().max(512),
                occupationRu: Joi.string().max(512),
                tel: Joi.string().max(20),
                mobile: Joi.string().max(20),
                role: Joi.object().keys({
                    id: Joi.string().max(6),
                    title: Joi.string().max(255),
                }).required()
            }).pattern(/./, Joi.any()),
            company: Joi.object().keys({
                nameEn: Joi.string().max(255).required(),
                nameRu: Joi.string().max(255).required(),
                tradeNameEn: Joi.string().max(255),
                tradeNameRu: Joi.string().max(255),
                license: Joi.string().max(255),
                country: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }),
                ceoFirstNameEn: Joi.string().max(255),
                ceoFirstNameRu: Joi.string().max(255),
                ceoLastNameEn: Joi.string().max(255),
                ceoLastNameRu: Joi.string().max(255),
                establishmentYear: Joi.number().max(new Date().getFullYear()),
                employersCount: Joi.number(),
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
                tel: Joi.string().max(20),
                website: Joi.string().max(124),
                cityEn: Joi.string().max(255),
                cityRu: Joi.string().max(255),
                addressEn: Joi.string().max(255),
                addressRu: Joi.string().max(255),
                zip: Joi.string().max(20),
            }).pattern(/./, Joi.any()),
            documents: Joi.array().items(Joi.object().keys({
                title: Joi.string().max(255),
                docId: Joi.string().max(255)
            })).pattern(/./, Joi.any())
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postAdminPartner;