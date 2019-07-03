import HttpException from "../httpException";
import i18n from "i18next";

class WrongOldPassword extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 322;
        const responseMessage: string = message || i18n.t('wrongOldPassword');
        const responseDevMessage: string = devMessage || 'User enter wrong old password';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default WrongOldPassword;