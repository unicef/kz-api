import HttpException from "./httpException";
import i18n from "i18next";

class BadActivationLink extends HttpException {
    /**
     * Create bad activation link exception
     * @param status 
     * @param errorCode 
     * @param message 
     * @param devMessage 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('badActivationLink');
        const responseDevMessage: string = devMessage || 'Bad activation link';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadActivationLink;