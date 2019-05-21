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
}