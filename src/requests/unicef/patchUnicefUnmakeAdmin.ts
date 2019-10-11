import { Request, Response, NextFunction } from 'express';
import LocalizationHelper from "../../helpers/localizationHelper";
import Joi from "@hapi/joi";
import i18n from "i18next";
import BadValidationException from '../../exceptions/badValidationException';
import getValidationErrorMessage from '../../helpers/getValidationErrorMessage';
import User from '../../models/user';
import UserNotfind from '../../exceptions/userNotFind';
import BadRole from '../../exceptions/user/badRole';
import exceptionHandler from '../../services/exceptionHandler';

interface PatchUnicefUnmakeAdmin extends Request
{
    adminUser: User
}

const requestValidation = Joi.object().options({
        abortEarly: false,
        language: LocalizationHelper.getValidationMessages()
    }).keys({
        userId: Joi.number().min(1).required()
    }).pattern(/./, Joi.any());

const middleware = async (expressRequest: Request, res: Response, next: NextFunction) => {
    const req = expressRequest as PatchUnicefUnmakeAdmin;
    try {
        requestValidation.validate(req.body, (err: any, value: any) => {
            req.body = value;
            if (err) {
                throw new BadValidationException(400, 129, getValidationErrorMessage(err), 'Validation error');
            }
        })
        // CHECK USER
        const userId = req.body.userId;
        const user = await User.findOne({
            where: {
                id: userId
            },
            include: [
                User.associations.roles,
                User.associations.personalData
            ]
        });
        if (user === null) {
            throw new UserNotfind();
        }
        // is user allready admin
        if (!user.isAdmin()) {
            throw new BadRole();
        }

        req.adminUser = user;

        return next();
    } catch (error) {
        return exceptionHandler(error, res);
    }
}

export { PatchUnicefUnmakeAdmin, middleware };