import HttpException from "./httpException";
import i18n from "i18next";

class BadRecaptchaException extends HttpException {
    /**
     * Create bad recaptcha exception
     * @param status 
     * @param errorCode 
     * @param message 
     * @param devMessage 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('badRecaptcha');
        const responseDevMessage: string = devMessage || 'Wrong google recaptcha';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadRecaptchaException;