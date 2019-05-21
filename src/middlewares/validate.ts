import { Request, Response, NextFunction } from "express";
import BadValidationException from "../exceptions/badValidationException";

export const validationProcess = (req: Request, res: Response, next: NextFunction, request: any) => {
    try {
        if (request.querySchema != null) {
            request.querySchema.validate(req.query, (err: any, value: any) => {
                req.query = value;
                if (err) {
                    throw new BadValidationException(400, err.message, 'Validation error');
                }
             })
        }

        if (request.bodySchema != null) {
            request.bodySchema.validate(req.body, (err: any, value: any) => {
                req.body = value;
                if (err) {
                    throw new BadValidationException(400, err.message, 'Validation error');
                }
             })
        }
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
        res.status(error.status).json(errorObj);
    }
    next();
};