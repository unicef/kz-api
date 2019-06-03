import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import i18n from "i18next";
import jwt from "jsonwebtoken";
import AuthRequiredException from "../exceptions/authRequiredException";
import BadTokenException from "../exceptions/badTokenException";
import User from "../models/user";
import BlockedUserException from "../exceptions/blockedUserException";
import AdminRoleException from "../exceptions/adminRoleException";

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret = config.jwt.secret;
        let token: string|boolean = req.headers['authorization'] || false;
    
        if (!token) {
            throw new AuthRequiredException(401, i18n.t('userAuthRequired'), i18n.t('userAuthRequired'));
        }
        // get token scheme
        const headerParts = token.split(' ');
        if (headerParts.length > 1) {
            let scheme = headerParts[0];
            token = headerParts[1];
        }
        if (token) {
            jwt.verify(token, jwtSecret, (err, decoded: any) => {
                if (err) {
                    throw new BadTokenException(401, i18n.t('badAuthToken'), i18n.t('badAuthToken'));
                } else {
                    let user =  User.findOne({
                        where: {
                            email: decoded.userEmail
                        },
                        include: [
                            User.associations.roles,
                            User.associations.personalData
                        ]
                    }).then((user) => {
                        if (user == null) {
                            throw new BadTokenException(401, i18n.t('badAuthToken'), i18n.t('badAuthToken'));
                        }
                        if (user && user.isBlocked) {
                            throw new BlockedUserException(403, i18n.t('userIsBlocked'), i18n.t('userIsBlocked'));
                        }
                        req.user = user;

                        if (!user.isAdmin()) {
                            throw new AdminRoleException(403, i18n.t('userNotAdmin'), i18n.t('userNotAdmin'))
                        }
                        next();
                    }).catch((error) => {
                        const status = error.status || 400;
                        const message = error.message || 'Something went wrong';
                        const errorCode = 214;
                
                        const errorObj: any = {
                            success: false,
                            status: status,
                            message: message,
                            errorCode: errorCode
                        }
                        res.status(status).json(errorObj);
                        return;
                    });     
              }
            })
        } else {
            throw new AuthRequiredException(401, i18n.t('userAuthRequired'), i18n.t('userAuthRequired'));
        }
    } catch (error) {
        const status = error.status || 400;
        const message = error.message || 'Something went wrong';
        const errorCode = 214;

        const errorObj: any = {
            success: false,
            error: {
                status: status,
                message: message,
                errorCode: errorCode
            }
        }
        res.status(status).json(errorObj);
        return;
    }
};

export default checkAdminRole;