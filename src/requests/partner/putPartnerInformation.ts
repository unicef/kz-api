import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import i18n from "i18next";
import BadValidationException from "../../exceptions/badValidationException";

const putPartnerInformation = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        company: Joi.object().options({
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
            country: Joi.object().keys({
                id: Joi.number(),
                title: Joi.string().max(255),
            }),
            ceoFirstNameEn: Joi.string().max(255).required(),
            ceoFirstNameRu: Joi.string().max(255).required(),
            ceoLastNameEn: Joi.string().max(255).required(),
            ceoLastNameRu: Joi.string().max(255).required(),
            establishmentYear: Joi.number().max(new Date().getFullYear()).required(),
            employersCount: Joi.number().required(),
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
            tel: Joi.string().max(20).required(),
            website: Joi.string().max(124).required(),
            cityEn: Joi.string().max(255).required(),
            cityRu: Joi.string().max(255).required(),
            addressEn: Joi.string().max(255).required(),
            addressRu: Joi.string().max(255).required(),
            zip: Joi.string().max(20).required(),
        }).pattern(/./, Joi.any()),
        authorizedPerson: Joi.object().options({
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
    
    validationRules.authorizedPerson.validate(req.body.authorizedPerson, (err: any, value: any) => {
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