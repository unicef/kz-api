import HttpException from "../httpException";
import i18n from "i18next";

class ReportNotFound extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 404;
        const responseErrorCode: number = errorCode || 110;
        const responseMessage: string = message || i18n.t('reportNotFoundError');
        const responseDevMessage: string = devMessage || 'Report not found';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default ReportNotFound;