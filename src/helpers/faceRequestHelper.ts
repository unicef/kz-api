import FaceRequest from "../models/faceRequest";
import Role from "../models/role";
import iInputActivity from "../interfaces/faceRequest/iInputActivity";
import FaceRequestChain from "../models/faceRequestChain";
import event from "../services/event";
import FaceRequestRejected from "../events/faceRequestRejected";
import Project from "../models/project";
import User from "../models/user";
import FaceRequestActivity from "../models/faceRequestActivity";
import ProjectTranche from "../models/projectTranche";
import ActivityRepository from "../repositories/activityRepository";
import FaceRequestApproved from "../events/faceRequestApproved";

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
            case FaceRequest.WAITING_STATUS_KEY: {
                if (user.hasRole(Role.partnerAssistId) && faceRequest.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;
            case FaceRequest.CONFIRM_STATUS_KEY: {
                if (user.hasRole(Role.partnerAuthorisedId) && faceRequest.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;
        }
        return isMyStage;
    }

    static checkRejectedActivities = async (activities: Array<iInputActivity>) => {
        let rejectedActivities: Array<iInputActivity> | [] = [];
        activities.forEach((activity) => {
            if (activity.isRejected) {
                rejectedActivities.push(activity);
            }
        })
        return rejectedActivities;
    }

    static rejectRequestProcess = async (user: User, faceRequest: FaceRequest, project: Project, rejectedActivities: Array<iInputActivity>, requestChain: FaceRequestChain) => {
        // update activities in DB
        rejectedActivities.forEach((activity: iInputActivity) => {
            FaceRequestActivity.update({ isRejected: true, rejectReason: activity.rejectReason }, {
                where: {
                    id: activity.id
                }
            })
        });
        const rejectRequest = await faceRequest.reject();
        const rejectChain = await requestChain.rejectRequest();

        // TODO : reject smart contract

        event(new FaceRequestRejected(user, faceRequest, project, rejectedActivities))
    }

    static confirmRequestProcess = async (user: User, activities: Array<iInputActivity>, faceRequest: FaceRequest, tranche: ProjectTranche, project: Project, requestChain: FaceRequestChain) => {
        // approve process
        // count amountF & amountG
        let amountsD = false;
        // get previous amountD from report
        const prevTrancheNum = tranche.num - 1;
        if (prevTrancheNum > 0) {
            amountsD = await ActivityRepository.getActivitiesAmountDFromReport(project.id, prevTrancheNum);
        }
        for (var i = 0; i < activities.length; i++) {
            let amountD = 0;
            const activity = activities[i];
            if (amountsD !== false) {
                amountsD.forEach(amount => {
                    if (amount.activityId === activity.activityId) {
                        amountD = amount.amountD;
                    }
                });
            }
            const amountF = activity.amountE - amountD;
            const activityUpdateData = {
                amountF: amountF,
                amountG: amountF + amountD
            }
            // update request Activity
            const update = await FaceRequestActivity.update(activityUpdateData, {
                where: {
                    id: activity.id
                }
            });
        }
        // set request statusId
        const confirmedAt = new Date();
        faceRequest.statusId = FaceRequest.VALIDATE_STATUS_KEY;
        faceRequest.approvedAt = confirmedAt;
        faceRequest.isValid = true;
        await faceRequest.save();
        requestChain.confirmAt = confirmedAt;
        await requestChain.save();
        event(new FaceRequestApproved(user, faceRequest, project));
    }
}

export default FaceRequestHelper;