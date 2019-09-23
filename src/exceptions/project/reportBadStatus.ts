import HttpException from "../httpException";
import i18n from "i18next";

class ReportBadStatus extends HttpException {
    /**
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 119;
        const responseMessage: string = message || i18n.t('reportBadStatusError');
        const responseDevMessage: string = devMessage || 'Report status does not allow action';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default ReportBadStatus;