import HttpException from "./httpException";
import i18n from "i18next";

class PartnerWithoutAuthorised extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 118;
        const responseMessage: string = message || i18n.t('partnerWithoutAuthorised');
        const responseDevMessage: string = devMessage || 'Couldn\'t update partner. Parner without authorised role ';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerWithoutAuthorised;