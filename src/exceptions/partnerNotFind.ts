import HttpException from "./httpException";
import i18n from "i18next";

class PartnerNotFind extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 110;
        const responseMessage: string = message || i18n.t('partnerNotFindError');
        const responseDevMessage: string = devMessage || 'Partner not found';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerNotFind;