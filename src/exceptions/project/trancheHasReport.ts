import HttpException from "../httpException";
import i18n from "i18next";

class TrancheHasReport extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 128;
        const responseMessage: string = message || i18n.t('trancheHasReport');
        const responseDevMessage: string = devMessage || 'Active project tranche allready has report';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default TrancheHasReport;