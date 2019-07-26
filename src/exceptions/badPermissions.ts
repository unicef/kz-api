import HttpException from "./httpException";
import i18n from "i18next";

class BadPermissions extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 403;
        const responseErrorCode: number = errorCode || 102;
        const responseMessage: string = message || i18n.t('badPermissionsError');
        const responseDevMessage: string = devMessage || 'User\'s permissions not enough';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadPermissions;