import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const putAdminPartner = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
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
                id: Joi.number().allow('').allow(null),
                nameEn: Joi.string().max(255).required(),
                nameRu: Joi.string().max(255).required(),
                tradeNameEn: Joi.string().max(255).allow('').allow(null),
                tradeNameRu: Joi.string().max(255).allow('').allow(null),
                license: Joi.string().max(255).allow('').allow(null),
                country: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }).allow(null),
                ceoFirstNameEn: Joi.string().max(255).allow('').allow(null),
                ceoFirstNameRu: Joi.string().max(255).allow('').allow(null),
                ceoLastNameEn: Joi.string().max(255).allow('').allow(null),
                ceoLastNameRu: Joi.string().max(255).allow('').allow(null),
                establishmentYear: Joi.number().max(new Date().getFullYear()).allow(null),
                employersCount: Joi.number().min(1).allow(null),
                areaOfWork: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }).allow(null),
                ownership: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }).allow(null),
                partnerType: Joi.object().keys({
                    id: Joi.number(),
                    title: Joi.string().max(255),
                }).allow(null),
                csoType: Joi.object().keys({
                    id: Joi.number().allow(null),
                    title: Joi.string().max(255).allow(null),
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