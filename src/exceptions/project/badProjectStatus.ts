import HttpException from "../httpException";
import i18n from "i18next";

class BadProjectStatus extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 119;
        const responseMessage: string = message || i18n.t('projectBadStatusError');
        const responseDevMessage: string = devMessage || 'Project status does not allow action';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadProjectStatus;