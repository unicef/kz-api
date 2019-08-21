import HttpException from "../httpException";
import i18n from "i18next";

class PartnerProjectsLimit extends HttpException {
    /**
     * Partner project limit exceeded exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 102;
        const responseMessage: string = message || i18n.t('partnerProjectsLimitExceeded');
        const responseDevMessage: string = devMessage || 'Partner already has limit of available projects';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerProjectsLimit;