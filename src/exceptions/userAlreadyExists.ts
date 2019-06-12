import HttpException from "./httpException";
import i18n from "i18next";

class UserAlreadyExists extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 112;
        const responseMessage: string = message || i18n.t('userExistsError');
        const responseDevMessage: string = devMessage || 'User allready exists';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default UserAlreadyExists;