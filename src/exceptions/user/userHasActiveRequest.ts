import HttpException from "../httpException";
import i18n from "i18next";

class UserHasActiveRequest extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 525;
        const responseMessage: string = message || i18n.t('userHasActiveRequest');
        const responseDevMessage: string = devMessage || 'User has active request';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default UserHasActiveRequest;