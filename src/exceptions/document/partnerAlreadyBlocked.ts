import HttpException from "../httpException";
import i18n from "i18next";

class LastPartnerDocument extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 194;
        const responseMessage: string = message || i18n.t('lastPartnerDocument');
        const responseDevMessage: string = devMessage || 'User can\'t delete last partner document';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default LastPartnerDocument;