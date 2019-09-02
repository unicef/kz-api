import HttpException from "./httpException";
import i18n from "i18next";

class UserNotfind extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 404;
        const responseErrorCode: number = errorCode || 116;
        const responseMessage: string = message || i18n.t('userNotFind');
        const responseDevMessage: string = devMessage || 'User with entered email wasn\'t find in the system';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default UserNotfind;