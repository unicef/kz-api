import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "../controllers/apiController";
import HttpException from "../exceptions/httpException";
import AuthRequiredException from "../exceptions/authRequiredException";
import checkAuthToken from "./checkAuthToken";
import BadRole from "../exceptions/user/badRole";

export const acceptRoles = (roles: string | Array<string>) => {
    return function (req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user === null) {
                throw new AuthRequiredException();
            }
            let hasRole = false;

            if (Array.isArray(roles)) {
                roles.forEach((roleId) => {
                    if (req.user.hasRole(roleId)) {
                        hasRole = true;
                    }
                })
            } else {
                if (req.user.hasRole(roles)) {
                    hasRole = true;
                }
            }
            if (hasRole) {
                next();
            } else {
                throw new BadRole(403, 3300, i18n.t('badPermissionsError'), "Bad role");
            }
            return;
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
        return next();
    }
}