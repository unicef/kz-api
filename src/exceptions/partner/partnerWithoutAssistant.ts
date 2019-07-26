import HttpException from "../httpException";
import i18n from "i18next";

class PartnerWithoutAssistant extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 118;
        const responseMessage: string = message || i18n.t('partnerWithoutAssistant');
        const responseDevMessage: string = devMessage || 'Couldn\'t update partner. Parner without assistant role';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerWithoutAssistant;