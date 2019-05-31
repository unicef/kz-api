import { Request, Response, NextFunction } from "express";
import BadValidationException from "../exceptions/badValidationException";
import Joi from "@hapi/joi";

export const validationProcess = (req: Request, res: Response, next: NextFunction, request: any) => {
    try {
        if (request.querySchema != null) {
            request.querySchema.validate(req.query, (err: any, value: any) => {
                req.query = value;
                if (err) {
                    const message = getErrorMessage(err);
                    throw new BadValidationException(400, message, 'Validation error');
                }
             })
        }

        if (request.bodySchema != null) {
            request.bodySchema.validate(req.body, (err: any, value: any) => {
                req.body = value;
                if (err) {
                    const message = getErrorMessage(err);

                    throw new BadValidationException(400, message, 'Validation error');
                }
             })
        }

        next();
    } catch (error) {
        const status = error.status || 400;
        const message = error.message || 'Something went wrong';
        const errorCode = 132;

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

const getErrorMessage = (errors: any) => {
    let message: string = '';
    // generatiing message
    errors.details.forEach(error => {
        message = message + ', ' + error.message;
    });
    message = message.substring(2);

    return message;
}