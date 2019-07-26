import HttpException from "./httpException";
import i18n from "i18next";

class AdminRoleException extends HttpException {
    /**
     * Create admin role exception
     * @param status 
     * @param errorCode 
     * @param message 
     * @param devMessage 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 403;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('userNotAdmin');
        const responseDevMessage: string = devMessage || 'Needs admin permissions';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default AdminRoleException;