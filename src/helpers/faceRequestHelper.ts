
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
        requestData.from = new Date(data.from);
        requestData.to = new Date(data.to);
        requestData.typeId = data.typeId;

        return requestData;
    }
}

export default FaceRequestHelper;