import { Request, Response, NextFunction } from "express";
import Config from "../services/config";
import jwt from "jsonwebtoken";
import AuthRequiredException from "../exceptions/authRequiredException";
import BadTokenException from "../exceptions/badTokenException";
import User from "../models/user";
import BlockedUserException from "../exceptions/blockedUserException";
import AdminRoleException from "../exceptions/adminRoleException";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";

export const checkAdminRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret: string = Config.get('JWT_SECRET', 'jwt_default');
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
            jwt.verify(token, jwtSecret, (err, decoded: any) => {
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

                        if (!user.isAdmin()) {
                            throw new AdminRoleException();
                        }
                        next();
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

export default checkAdminRole;