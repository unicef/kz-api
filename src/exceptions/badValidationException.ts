import HttpException from "./httpException";
import i18n from "i18next";

class BadValidationException extends HttpException {
    /**
     * Create bad validation exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 129;
        const responseMessage: string = message || i18n.t('validationError');
        const responseDevMessage: string = devMessage || 'Validation error.';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default BadValidationException;