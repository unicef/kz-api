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

    static failed = (status: number, message: string, errorCode?: number, res: Response) => {
        const code = errorCode || 132;

        const errorObj: any = {
            success: false,
            status: status,
            message: message,
            errorCode: code
        }
        res.status(status).json(errorObj);
        return;
    }
}