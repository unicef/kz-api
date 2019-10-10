import { Request, Response, NextFunction } from "express";
import BadValidationException from "../exceptions/badValidationException";
import exceptionHandler from "../services/exceptionHandler";

export const validationProcess = (req: Request, res: Response, next: NextFunction, request: any) => {
    try {
        if (request.querySchema != null) {
            request.querySchema.validate(req.query, (err: any, value: any) => {
                req.query = value;
                if (err) {
                    throw new BadValidationException(400, 129, getErrorMessage(err), 'Validation error');
                }
             })
        }

        if (request.bodySchema != null) {
            request.bodySchema.validate(req.body, (err: any, value: any) => {
                req.body = value;
                if (err) {
                    throw new BadValidationException(400, 129, getErrorMessage(err), 'Validation error');
                }
             })
        }

        next();
    } catch (error) {
        return exceptionHandler(error, res);
    }
};

const getErrorMessage = (errors: any) => {
    let message: string = '';
    // generatiing message
    errors.details.forEach((error: any) => {
        message = message + ', ' + error.message;
    });
    message = message.substring(2);

    return message;
}