import HttpException from "./httpException";
import i18n from "i18next";

class BlockedUserException extends HttpException {
    /**
     * Create blocked user exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 403;
        const responseErrorCode: number = errorCode || 141;
        const responseMessage: string = message || i18n.t('userIsBlocked');
        const responseDevMessage: string = devMessage || 'User is blocked.';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BlockedUserException;