import HttpException from "./httpException";
import i18n from "i18next";

class BadSetPasswordLink extends HttpException {
    /**
     * Create bad set password link exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 130;
        const responseMessage: string = message || i18n.t('badSetPasswordLink');
        const responseDevMessage: string = devMessage || 'Bad set password link';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadSetPasswordLink;