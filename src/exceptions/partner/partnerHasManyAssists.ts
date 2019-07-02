import HttpException from "../httpException";
import i18n from "i18next";

class PartnerHasManyAssists extends HttpException {
    /**
     * Create partner without authorised exception
     * @param status 
     * @param message 
     */
    constructor(status?: number, errorCode?: number, message?: string, devMessage?: string) {
        const responseStatus: number = status || 400;
        const responseErrorCode: number = errorCode || 118;
        const responseMessage: string = message || i18n.t('partnerHasManyAssists');
        const responseDevMessage: string = devMessage || 'Parner has too many assist';
        super(responseStatus, responseErrorCode, responseMessage, responseDevMessage);
    }
}

export default PartnerHasManyAssists;