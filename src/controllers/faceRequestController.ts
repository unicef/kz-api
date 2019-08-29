import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import FaceRequestHelper from "../helpers/faceRequestHelper";

class FaceRequestController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lang: string = i18n.language;
            const faceRequestTypes = [...FaceRequestHelper.requestTypes];

            faceRequestTypes.map((type: {id:number, ru: string, en: string, title?:string}) => {
                type.title = type[lang];
                delete type.ru;
                delete type.en;

                return type;
            })

            return ApiController.success({type: faceRequestTypes}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }
}

export default FaceRequestController;