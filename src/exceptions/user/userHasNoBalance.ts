import HttpException from "../httpException";
import i18n from "i18next";

class UserHasNoBalance extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 364;
        const responseMessage: string = message || i18n.t('userWalletHasNoBalance');
        const responseDevMessage: string = devMessage || 'Balance of users wallet not enough to make transaction';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default UserHasNoBalance;