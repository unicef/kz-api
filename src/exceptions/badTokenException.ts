import HttpException from "./httpException";
import i18n from "i18next";

class BadTokenException extends HttpException {
    /**
     * Create bad token exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 401;
        const responseErrorCode: number = errorCode || 214;
        const responseMessage: string = message || i18n.t('badAuthToken');
        const responseDevMessage: string = devMessage || 'Bad auth token';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadTokenException;