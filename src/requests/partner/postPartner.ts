import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";
import LocalizationHelper from "../../helpers/localizationHelper";

const postPartner = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object().options({
            abortEarly: false,
            language: LocalizationHelper.getValidationMessages()
        }).keys({
            nameEn: Joi.string().max(255).required(),
            nameRu: Joi.string().max(255).required(),
            tradeNameEn: Joi.string().max(255).allow('').allow(null),
            tradeNameRu: Joi.string().max(255).allow('').allow(null),
            license: Joi.string().max(255).allow('').allow(null),
            countryId: Joi.number().required(),
            ceoFirstNameEn: Joi.string().max(255).required(),
            ceoFirstNameRu: Joi.string().max(255).required(),
            ceoLastNameEn: Joi.string().max(255).required(),
            ceoLastNameRu: Joi.string().max(255).required(),
            establishmentYear: Joi.number().max(new Date().getFullYear()).required(),
            employersCount: Joi.number().min(1).required(),
            areaOfWorkId: Joi.number().required(),
            ownershipId: Joi.number().required(),
            partnerTypeId: Joi.number().required(),
            csoTypeId: Joi.number(),
            tel: Joi.string().max(20).allow('').allow(null),
            website: Joi.string().max(124).allow('').allow(null),
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