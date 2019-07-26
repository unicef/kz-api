import HttpException from "./httpException";
import i18n from "i18next";

class BadEmailException extends HttpException {
     /**
     * Create bad email exception
     * @param status 
     * @param errorCode 
     * @param message 
     * @param devMessage 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 403;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('badEmailOrPass');
        const responseDevMessage: string = devMessage || 'Bad email or password exception';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadEmailException;