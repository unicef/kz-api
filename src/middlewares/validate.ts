import { Request, Response, NextFunction } from "express";
import BadValidationException from "../exceptions/badValidationException";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";

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
        if (error instanceof HttpException) {
            error.response(res);
        } else {
            ApiController.failed(500, error.message, res);
        }
        return ;
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