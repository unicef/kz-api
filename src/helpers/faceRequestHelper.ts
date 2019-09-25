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
import MultisignatureContract from "../services/multisignatureContract";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";
import BlockchainHelper from "./blockchainHelper";
import UserRepository from "../repositories/userRepository";
import { Sequelize } from "sequelize";

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

    static isMyStage = async (faceRequest, user) => {
        let isMyStage = false;
        if (faceRequest.isFreeze === true) {
            return isMyStage;
        }
        switch (faceRequest.statusId) {
            case FaceRequest.WAITING_STATUS_KEY: {
                if (user.hasRole(Role.partnerAssistId) && faceRequest.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;

            case FaceRequest.REJECT_STATUS_KEY: {
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
            case FaceRequest.VALIDATE_STATUS_KEY: {
                // get faceRequest chain
                const requestChain = await FaceRequestChain.findOne({
                    where: {
                        requestId: faceRequest.id
                    }
                });
                if (requestChain && requestChain.validateBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceRequest.CERTIFY_STATUS_KEY: {
                // get faceRequest chain
                const requestChain = await FaceRequestChain.findOne({
                    where: {
                        requestId: faceRequest.id
                    }
                });
                if (requestChain && requestChain.certifyBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceRequest.APPROVE_STATUS_KEY: {
                // get faceRequest chain
                const requestChain = await FaceRequestChain.findOne({
                    where: {
                        requestId: faceRequest.id
                    }
                });
                if (requestChain && requestChain.approveBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceRequest.VERIFY_STATUS_KEY: {
                // get faceRequest chain
                const requestChain = await FaceRequestChain.findOne({
                    where: {
                        requestId: faceRequest.id
                    }
                });
                if (requestChain && requestChain.verifyBy == user.id) {
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
        // reject smart contract
        // get request contract object
        const requestContract = await FaceRequestContractRepository.findByRequestId(faceRequest.id);
        if (requestContract && requestContract.contractAddress) {
            BlockchainHelper.rejectContract(requestContract.contractAddress, user);
        }

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
                        amountD = parseInt(amount.amountD);
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

    static isNextUserAttachedtoChain = async (requestId: number, nextUserId: number) => {
        const Op = Sequelize.Op;
        const requestChain = await FaceRequestChain.findOne({
            where: {
                requestId: requestId,
                [Op.or]: [
                    { validateBy: nextUserId },
                    { certifyBy: nextUserId },
                    { approveBy: nextUserId },
                    { verifyBy: nextUserId }
                ]
            }
        });

        if (requestChain) {
            return true;
        } else {
            return false;
        }
    }

    static validateRequestProcess = async (user: User, activities: Array<iInputActivity>, faceRequest: FaceRequest, tranche: ProjectTranche, project: Project, requestChain: FaceRequestChain, nextUser: User) => {
        MultisignatureContract.deployContract(user, nextUser.id, faceRequest);
        faceRequest.isFreeze = true;
        // update status
        faceRequest.statusId = FaceRequest.CERTIFY_STATUS_KEY;
        faceRequest.save();
        // set next user to chain
        requestChain.certifyBy = nextUser.id;
        requestChain.validateAt = new Date();
        requestChain.save();

        return true;
    }

    static certifyRequestProcess = async (user: User, activities: Array<iInputActivity>, faceRequest: FaceRequest, tranche: ProjectTranche, project: Project, requestChain: FaceRequestChain, nextUser: User) => {
        // get request contract address
        const contract = await FaceRequestContractRepository.findByRequestId(faceRequest.id);
        if (contract === null || contract.contractAddress === null) {
            throw new Error(`Request doesn't have contract address`);
        }
        const contractAddress = contract.contractAddress;
        const nextUserWallet = await UserRepository.findWalletById(nextUser.id);
        BlockchainHelper.confirmContract(contractAddress, faceRequest.id, faceRequest.statusId, user, nextUserWallet);
        faceRequest.isFreeze = true;
        faceRequest.statusId = FaceRequest.APPROVE_STATUS_KEY;
        faceRequest.save();
        // set next user to chain
        requestChain.approveBy = nextUser.id;
        requestChain.certifyAt = new Date();
        requestChain.save();

        return true;
    }

    static approveRequestProcess = async (user: User, activities: Array<iInputActivity>, faceRequest: FaceRequest, tranche: ProjectTranche, project: Project, requestChain: FaceRequestChain, nextUser: User) => {
        // get request contract address
        const contract = await FaceRequestContractRepository.findByRequestId(faceRequest.id);
        if (contract === null || contract.contractAddress === null) {
            throw new Error(`Request doesn't have contract address`);
        }
        const contractAddress = contract.contractAddress;
        const nextUserWallet = await UserRepository.findWalletById(nextUser.id);
        BlockchainHelper.confirmContract(contractAddress, faceRequest.id, faceRequest.statusId, user, nextUserWallet);
        faceRequest.isFreeze = true;
        faceRequest.statusId = FaceRequest.VERIFY_STATUS_KEY;
        faceRequest.save();
        // set next user to chain
        requestChain.verifyBy = nextUser.id;
        requestChain.approveAt = new Date();
        requestChain.save();

        return true;
    }

    static verifyRequestProcess = async (user: User, activities: Array<iInputActivity>, faceRequest: FaceRequest, tranche: ProjectTranche, project: Project, requestChain: FaceRequestChain) => {
        // get request contract address
        const contract = await FaceRequestContractRepository.findByRequestId(faceRequest.id);
        if (contract === null || contract.contractAddress === null) {
            throw new Error(`Request doesn't have contract address`);
        }
        const contractAddress = contract.contractAddress;
        const nextUserWallet = {
            address: '0x0000000000000000000000000000000000000000'
        }
        BlockchainHelper.confirmContract(contractAddress, faceRequest.id, faceRequest.statusId, user, nextUserWallet);
        faceRequest.isFreeze = true;
        faceRequest.statusId = FaceRequest.SUCCESS_STATUS_KEY;
        faceRequest.save();
        // set verifyAt property
        requestChain.verifyAt = new Date();
        requestChain.save();

        return true;
    }
}

export default FaceRequestHelper;