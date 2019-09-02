import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";
import i18n from "i18next";
import BadValidationException from "../../exceptions/badValidationException";
import Role from "../../models/role";
import LocalizationHelper from "../../helpers/localizationHelper";

const putUserStepInformation = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        user: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            firstNameEn: Joi.string().max(255).required(),
            firstNameRu: Joi.string().max(255).required(),
            lastNameEn: Joi.string().max(255).required(),
            lastNameRu: Joi.string().max(255).required(),
            occupationEn: Joi.string().max(512).required(),
            occupationRu: Joi.string().max(512).required(),
            tel: Joi.string().max(20).allow('').allow(null),
            mobile: Joi.string().max(20).required(),
        }).pattern(/./, Joi.any())
    };

    validationRules.user.validate(req.body.user, (err: any, value: any) => {
        if (err) {
            throw new BadValidationException(400, 129, getErrorMessage(err), 'Validation error');
        }
     })
     if (req.user.hasRole(Role.donorId)) {
        if (req.body.user.companyEn==null || req.body.user.companyEn=='' || req.body.user.companyRu==null || req.body.user.companyRu=='') {
            throw new BadValidationException(400, 129, i18n.t('emptyDonorsCompanyField'), 'Validation error');
        }
     }
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

export default putUserStepInformation;