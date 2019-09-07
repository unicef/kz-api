import HttpException from "../httpException";
import i18n from "i18next";

class ProjectHasNoActiveTranche extends HttpException {
    /**
     * Create project allready has tranches exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 809;
        const responseMessage: string = message || i18n.t('projectHasNoActiveTrancheError');
        const responseDevMessage: string = devMessage || 'Project has no active tranches';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default ProjectHasNoActiveTranche;