import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import i18n from "i18next";
import jwt from "jsonwebtoken";
import AuthRequiredException from "../exceptions/authRequiredException";
import BadTokenException from "../exceptions/badTokenException";
import User from "../models/user";
import BlockedUserException from "../exceptions/blockedUserException";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";

export const checkAuthToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret = config.jwt.secret;
        let token: string|boolean = req.headers['authorization'] || false;
    
        if (!token) {
            throw new AuthRequiredException();
        }
        // get token scheme
        const headerParts = token.split(' ');
        if (headerParts.length > 1) {
            let scheme = headerParts[0];
            token = headerParts[1];
        }
        if (token) {
            const verify = await jwt.verify(token, jwtSecret, (err, decoded: any) => {
                if (err) {
                    throw new BadTokenException();
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
                            throw new BadTokenException();
                        }
                        if (user && user.isBlocked) {
                            throw new BlockedUserException();
                        }
                        req.user = user;
                        next();
                        return user;
                    }).catch((error) => {
                        if (error instanceof HttpException) {
                            error.response(res);
                        } else {
                            ApiController.failed(500, error.message, res);
                        }
                        return ;
                    });     
              }
            })
            return verify;
        } else {
            throw new AuthRequiredException();
        }
    } catch (error) {
        if (error instanceof HttpException) {
            error.response(res);
        } else {
            ApiController.failed(500, error.message, res);
        }
        return ;
    }
};

export default checkAuthToken;