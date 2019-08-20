import HttpException from "../httpException";
import i18n from "i18next";

class NeedAnotherProjectType extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 131;
        const responseMessage: string = message || i18n.t('projectTypeDoesNotFitBudget');
        const responseDevMessage: string = devMessage || 'Project needs to be another type';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default NeedAnotherProjectType;