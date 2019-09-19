import HttpException from "../httpException";
import i18n from "i18next";

class BadTrancheStatus extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 119;
        const responseMessage: string = message || i18n.t('trancheBadStatusError');
        const responseDevMessage: string = devMessage || 'Tranche status does not allow action';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadTrancheStatus;