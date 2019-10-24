import { Request, Response, NextFunction } from "express";
import { RecaptchaV2  } from "express-recaptcha";
import BadRecaptchaException from "../exceptions/badRecaptchaException";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";
import Config from "../services/config";

export const checkRecaptcha = (req: Request, res: Response, next: NextFunction) => {
    const recaptchaSite: string = Config.get("RECAPTCHA_SITE", "");
    const recaptchaSecret: string = Config.get("RECAPTCHA_SECRET", "");
    const recaptcha = new RecaptchaV2(recaptchaSite, recaptchaSecret);
    try {
        recaptcha.verify(req, (error, data) => {
            const env = Config.get("NODE_ENV", "development");
            if (error && (env!=="development" && env!=="test")) {
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