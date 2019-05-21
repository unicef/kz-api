import { Request, NextFunction, Response } from "express";
import BadValidationException from "../exceptions/badValidationException";

abstract class ApiRequest {
    static validate(req: Request, res: Response, next: NextFunction) {
        try {
            if (self.querySchema != null) {
                this.querySchema.validate(req.query, (err: any, value: any) => {
                    req.query = value;
                    if (err) {
                        throw new BadValidationException(400, err.message, 'Validation error');
                    }
                 })
            }
    
            if (this.bodySchema != null) {
                this.bodySchema.validate(req.body, (err: any, value: any) => {
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
    }
}

export default ApiRequest; 