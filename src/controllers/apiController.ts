import { Response } from "express";

export default class ApiController {

    /**
     * Return success API response
     * @param data 
     * @param res 
     */
    static success = (data: any, res: Response) => {
        const responseObj = {
            success: true,
            error: {},
            data: data
        }

        res.status(200).json(responseObj);
    }

    static failed = (status: number, message: string, res: Response, errorCode?: number) => {
        const code = errorCode || 132;
        const responseCode = status || 400;

        const errorObj: any = {
            success: false,
            error: {
                status: responseCode,
                message: message,
                errorCode: code
            }
        }
        res.status(responseCode).json(errorObj);
        return;
    }
}