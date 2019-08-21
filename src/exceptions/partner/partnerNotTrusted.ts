import HttpException from "../httpException";
import i18n from "i18next";

class PartnerNotTrusted extends HttpException {
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 103;
        const responseMessage: string = message || i18n.t('partnerNotTrusted');
        const responseDevMessage: string = devMessage || 'Partner needs to be a trusted';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerNotTrusted;