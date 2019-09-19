import FaceRequest from "../models/faceRequest";
import Role from "../models/role";

class FaceRequestHelper {
    static requestTypes = [
        {
            id: 1,
            en: `Direct Cash Transfer`,
            ru: `Прямой перевод денег`
        }, 
        {
            id: 2,
            en: `Reimbursement`,
            ru: `Возмещение`
        },
        {
            id: 3,
            en: `Direct Payment`,
            ru: `Прямая оплата`
        }
    ];

    static getRequestData = (data: any) => {
        let requestData: any = {};
        requestData.from = new Date(data.dateFrom);
        requestData.to = new Date(data.dateTo);
        requestData.typeId = data.type;
        requestData.isCertify = data.isCertify;

        return requestData;
    }

    static isMyStage = (faceRequest, user) => {
        let isMyStage = false;
        switch (faceRequest.statusId) {
            case FaceRequest.WAITING_STATUS_KEY : {
                if (user.hasRole(Role.partnerAssistId) && faceRequest.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
            break;
            case FaceRequest.CONFIRM_STATUS_KEY : {
                if (user.hasRole(Role.partnerAuthorisedId) && faceRequest.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
            break;
        }
        return isMyStage;
    }
}

export default FaceRequestHelper;