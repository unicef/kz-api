import HttpException from "./httpException";
import i18n from "i18next";

class UserIsNotActivated extends HttpException {
    /**
     * Create User not activated exception
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 412;
        const responseErrorCode: number = errorCode || 111;
        const responseMessage: string = message || i18n.t('userIsNotActivated');
        const responseDevMessage: string = devMessage || 'User\'s not activated.';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default UserIsNotActivated;