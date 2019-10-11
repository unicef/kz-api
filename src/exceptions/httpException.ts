import { Response } from "express";
import Config from "../services/config";
/**
 * Http Exception class
 */
class HttpException extends Error {
    /**
     * Http responce code
     */
    status: number;

    /**
     * Error message
     */
    message: string;

    /**
     * Message for developers (only on development env mode)
     */
    devMessage: string;

    /**
     * Error code
     */
    errorCode: number;

    /**
     * Create Http exception
     * @param status 
     * @param message 
     */
    constructor(status: number, errorCode: number,  message: string, devMessage: string) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.message = message;
        this.devMessage = devMessage;
    }

    /**
     * Sending error response
     * @param res 
     */
    public response(res: Response) {
        const errorObj: any = {
                status: this.status,
                errorCode: this.errorCode,
                message: this.message,
            };
        if (Config.get("NODE_ENV", "development") == "development") {
            errorObj['devMessage'] = this.devMessage;
        }

        res.status(this.status).json({
            success: false,
            error: errorObj
        });
        return;
    }
}

export default HttpException;