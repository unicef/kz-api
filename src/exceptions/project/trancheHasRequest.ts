import HttpException from "../httpException";
import i18n from "i18next";

class TrancheHasRequest extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 128;
        const responseMessage: string = message || i18n.t('trancheHasRequest');
        const responseDevMessage: string = devMessage || 'Active project tranche allready yas request';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default TrancheHasRequest;