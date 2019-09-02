import HttpException from "../httpException";
import i18n from "i18next";

class ProjectNotFound extends HttpException {
    /**
     * Create user allready exists exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 404;
        const responseErrorCode: number = errorCode || 110;
        const responseMessage: string = message || i18n.t('projectNotFoundError');
        const responseDevMessage: string = devMessage || 'Project not found';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default ProjectNotFound;