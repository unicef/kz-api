import { Request, Response, NextFunction } from "express";
import { RecaptchaV3, RecaptchaV2  } from "express-recaptcha";

export const checkRecaptcha = (req: Request, res: Response, next: NextFunction) => {
    const recaptchaSite: string = process.env.RECAPTCHA_SITE || '';
    const recaptchaSecret: string = process.env.RECAPTCHA_SECRET || '';
    const recaptcha = new RecaptchaV2(recaptchaSite, recaptchaSecret);
    try {
        recaptcha.verify(req, (error, data) => {
            if (error && process.env.NODE_ENV!=='development') {
                //throw new BadRecaptchaException(400, 'Bad recaptcha', error);
                const status = 400;
                const message = 'Bad recaptcha';
                const errorCode = 133;

                const errorObj: any = {
                    success: false,
                    status: status,
                    message: message,
                    errorCode: errorCode
                }
                res.status(status).json(errorObj);
                return;
            }

            next();
        });
    } catch (error) {
        const status = error.status || 400;
        const message = error.message || 'Something went wrong';
        const errorCode = 132;

        const errorObj: any = {
            success: false,
            status: status,
            message: message,
            errorCode: errorCode
        }
        res.status(status).json(errorObj);
        return;
    }
};