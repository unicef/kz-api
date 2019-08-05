import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import i18n from "i18next";
import LocalizationHelper from "../../helpers/localizationHelper";
import BadValidationException from "../../exceptions/badValidationException";

const putPartnerInformation = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        company: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            nameEn: Joi.string().max(255).required(),
            nameRu: Joi.string().max(255).required(),
            tradeNameEn: Joi.string().max(255).allow('').allow(null),
            tradeNameRu: Joi.string().max(255).allow('').allow(null),
            license: Joi.string().max(255).allow('').allow(null),
            country: Joi.object().keys({
                id: Joi.number(),
                title: Joi.string().max(255),
            }),
            ceoFirstNameEn: Joi.string().max(255).required(),
            ceoFirstNameRu: Joi.string().max(255).required(),
            ceoLastNameEn: Joi.string().max(255).required(),
            ceoLastNameRu: Joi.string().max(255).required(),
            establishmentYear: Joi.number().max(new Date().getFullYear()).required(),
            employersCount: Joi.number().min(1).required(),
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
                id: Joi.number().allow(null),
                title: Joi.string().max(255).allow(null),
            }).allow(null),
            tel: Joi.string().max(20).allow('').allow(null),
            website: Joi.string().max(124).allow('').allow(null),
            cityEn: Joi.string().max(255).required(),
            cityRu: Joi.string().max(255).required(),
            addressEn: Joi.string().max(255).required(),
            addressRu: Joi.string().max(255).required(),
            zip: Joi.string().max(20).required(),
        }).pattern(/./, Joi.any()),
        authorisedPerson: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            firstNameEn: Joi.string().max(255).required(),
            firstNameRu: Joi.string().max(255).required(),
            lastNameEn: Joi.string().max(255).required(),
            lastNameRu: Joi.string().max(255).required(),
            occupationEn: Joi.string().max(512).required(),
            occupationRu: Joi.string().max(512).required(),
        }).pattern(/./, Joi.any())
    };

    validationRules.company.validate(req.body.company, (err: any, value: any) => {
        if (err) {
            throw new BadValidationException(400, 129, getErrorMessage(err), 'Validation error');
        }
    })
    
    validationRules.authorisedPerson.validate(req.body.authorisedPerson, (err: any, value: any) => {
        if (err) {
            throw new BadValidationException(400, 129, getErrorMessage(err), 'Validation error');
        }
    })

    return true;
}

const getErrorMessage = (errors: any) => {
    let message: string = '';
    // generatiing message
    errors.details.forEach((error: any) => {
        message = message + ', ' + error.message;
    });
    message = message.substring(2);

    return message;
}

export default putPartnerInformation;