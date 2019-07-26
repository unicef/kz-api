import HttpException from "./httpException";
import i18n from "i18next";

class AuthRequiredException extends HttpException {
    /**
     * Create auth required exception
     * @param status 
     * @param errorCode 
     * @param message 
     * @param devMessage 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 401;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('userAuthRequired');
        const responseDevMessage: string = devMessage || 'User doesn\'t authenticated';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default AuthRequiredException;