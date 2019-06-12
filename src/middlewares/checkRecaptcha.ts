import { Request, Response, NextFunction } from "express";
import { RecaptchaV2  } from "express-recaptcha";
import BadRecaptchaException from "../exceptions/badRecaptchaException";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";

export const checkRecaptcha = (req: Request, res: Response, next: NextFunction) => {
    const recaptchaSite: string = process.env.RECAPTCHA_SITE || '';
    const recaptchaSecret: string = process.env.RECAPTCHA_SECRET || '';
    const recaptcha = new RecaptchaV2(recaptchaSite, recaptchaSecret);
    try {
        recaptcha.verify(req, (error, data) => {
            if (error && process.env.NODE_ENV!=='development') {
                throw new BadRecaptchaException();
            }
            next();
        });
    } catch (error) {
        if (error instanceof HttpException) {
            error.response(res);
        } else {
            ApiController.failed(500, error.message, res);
        }
        return ;
    }
};