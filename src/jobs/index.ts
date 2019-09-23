import { CronJob } from "cron";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";
import BlockchainHelper from "../helpers/blockchainHelper";
import FaceRequest from "../models/faceRequest";
import FaceRequestChain from "../models/faceRequestChain";
import User from "../models/user";
import ProjectRepository from "../repositories/projectRepository";
import event from "../services/event";
import FaceRequestApproved from "../events/faceRequestApproved";
import Project from "../models/project";

class Jobs {
    private jobs: Array<CronJob>|[] = [
        new CronJob('*/30 * * * * *', async () => {
            // get face request without contracts addresses
            const requestIds = await FaceRequestContractRepository.getNotContractRequests();
            if (requestIds.length > 0) {
                for (var i=0; i<requestIds.length; i++) {
                    const transaction = requestIds[i].contractHash;
                    const receipt = await BlockchainHelper.getTransactionReceipt(transaction);
                    if (receipt && receipt.contractAddress) {
                        const contractAddress =  receipt.contractAddress;
                        await FaceRequestContractRepository.setContractProperty(requestIds[i].requestId, 'contractAddress', contractAddress);
                        // send submit tranzaction web3 request
                        await BlockchainHelper.sendSubmitTransaction(contractAddress, requestIds[i].requestId);
                    }
                }
            }
        }),
        new CronJob('*/30 * * * * *', async () => {
            // get face request without contracts addresses
            const requestIds = await FaceRequestContractRepository.getNotValidRequests();
            if (requestIds.length > 0) {
                for (var i=0; i<requestIds.length; i++) {
                    const requestRow = requestIds[i];
                    const transaction = requestRow.validateHash;
                    const receipt = await BlockchainHelper.getTransactionReceipt(transaction);
                    if (receipt && receipt.status) {
                        // write validateReceipt (transaction block hash)
                        const blockHash = receipt.blockHash;
                        await FaceRequestContractRepository.setContractProperty(requestRow.requestId, 'validateReceipt', blockHash);
                        // set is Freeze of request to false
                        // event request was validate
                        const faceRequest = await FaceRequest.findOne({
                            where: {
                                id: requestRow.requestId
                            }
                        });
                        faceRequest.update({isFreeze: false});
                        const requestChain = await FaceRequestChain.findOne({
                            where: {
                                requestId: requestRow.requestId
                            },
                            attributes: ['id', 'validateAt', 'validateBy']
                        });
                        requestChain.update({validateAt: new Date()});
                        const user = await User.findOne({
                            where: {
                                id: requestChain.validateBy
                            },
                            include: [
                                User.associations.roles,
                                User.associations.personalData
                            ]
                        });
                        const projectId = await ProjectRepository.getProjectIdByRequestId(faceRequest.id);
                        const project = await Project.findOne({
                            where: {
                                id: projectId
                            }
                        });
                        event(new FaceRequestApproved(user, faceRequest, project));
                    }
                }
            }
        }),
        new CronJob('*/30 * * * * *', async () => {
            // get face request without contracts addresses
            const requestIds = await FaceRequestContractRepository.getNotCertiriedRequests();
            if (requestIds.length > 0) {
                for (var i=0; i<requestIds.length; i++) {
                    const requestRow = requestIds[i];
                    const transaction = requestRow.certifyHash;
                    const receipt = await BlockchainHelper.getTransactionReceipt(transaction);
                    if (receipt && receipt.status) {
                        // write validateReceipt (transaction block hash)
                        const blockHash = receipt.blockHash;
                        await FaceRequestContractRepository.setContractProperty(requestRow.requestId, 'certifyReceipt', blockHash);
                        // set is Freeze of request to false
                        // event request was validate
                        const faceRequest = await FaceRequest.findOne({
                            where: {
                                id: requestRow.requestId
                            }
                        });
                        faceRequest.update({isFreeze: false});
                        const requestChain = await FaceRequestChain.findOne({
                            where: {
                                requestId: requestRow.requestId
                            },
                            attributes: ['id', 'certifyAt', 'certifyBy']
                        });
                        requestChain.update({certifyAt: new Date()});
                        const user = await User.findOne({
                            where: {
                                id: requestChain.certifyBy
                            },
                            include: [
                                User.associations.roles,
                                User.associations.personalData
                            ]
                        });
                        const projectId = await ProjectRepository.getProjectIdByRequestId(faceRequest.id);
                        const project = await Project.findOne({
                            where: {
                                id: projectId
                            }
                        });
                        event(new FaceRequestApproved(user, faceRequest, project));
                    }
                }
            }
        }),
        new CronJob('*/30 * * * * *', async () => {
            // get face request without contracts addresses
            const requestIds = await FaceRequestContractRepository.getNotApprovedRequests();
            if (requestIds.length > 0) {
                for (var i=0; i<requestIds.length; i++) {
                    const requestRow = requestIds[i];
                    const transaction = requestRow.approveHash;
                    const receipt = await BlockchainHelper.getTransactionReceipt(transaction);
                    if (receipt && receipt.status) {
                        // write validateReceipt (transaction block hash)
                        const blockHash = receipt.blockHash;
                        await FaceRequestContractRepository.setContractProperty(requestRow.requestId, 'approveReceipt', blockHash);
                        // set is Freeze of request to false
                        // event request was validate
                        const faceRequest = await FaceRequest.findOne({
                            where: {
                                id: requestRow.requestId
                            }
                        });
                        faceRequest.update({isFreeze: false});
                        const requestChain = await FaceRequestChain.findOne({
                            where: {
                                requestId: requestRow.requestId
                            },
                            attributes: ['id', 'approveAt', 'approveBy']
                        });
                        requestChain.update({approveAt: new Date()});
                        const user = await User.findOne({
                            where: {
                                id: requestChain.approveBy
                            },
                            include: [
                                User.associations.roles,
                                User.associations.personalData
                            ]
                        });
                        const projectId = await ProjectRepository.getProjectIdByRequestId(faceRequest.id);
                        const project = await Project.findOne({
                            where: {
                                id: projectId
                            }
                        });
                        event(new FaceRequestApproved(user, faceRequest, project));
                    }
                }
            }
        })
    ];

    constructor () {
        this.jobs.forEach((job) => {
            job.start();
        })
    }
}

export default Jobs;