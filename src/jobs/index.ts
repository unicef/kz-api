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
import FaceRequestDone from "../events/faceRequestDone";
import ProjectTransaction from "../models/projectTransaction";
import Config from "../services/config";
import axios from "axios";
import convert from "xml-js";
import Setting from "../models/setting";

// '00 00 00 * * *'

class Jobs {
    private jobs: Array<CronJob>|[] = [
        new CronJob('00 00 00 * * *', async () => {
            const rateLink = Config.get('CURRENCY_RATE_LINK', 'https://treasury.un.org/operationalrates/xsql2XML.php');
            const request = axios.get(
                rateLink
            ).then((response) => {
                if (response.status == 200) {
                    var result1 = convert.xml2json(response.data, {compact: true, spaces: 4});

                    const result = JSON.parse(result1);
                    const rates = result['UN_OPERATIONAL_RATES_DATASET']['UN_OPERATIONAL_RATES'];

                    rates.forEach((rate) => {
                        if (rate['f_curr_code']['_text'] == 'KZT\t') {
                            const rateAmountString = rate['rate']['_text'];
                            const rateAmountNumber = rateAmountString.replace('\t','');
                            Setting.update({
                                value: rateAmountNumber
                            }, {
                                where: {
                                    key: 'KZTRate'
                                }
                            })
                        }
                    })
                }
            })
        }),
        // CRON job for getting contract address
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
        // CRON job for getting VALID status transaction
        new CronJob('*/30 * * * * *', async () => {
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
        // CRON job for getting CERTIFY status transaction
        new CronJob('*/30 * * * * *', async () => {
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
        // CRON job for getting APPROVE status transaction
        new CronJob('*/30 * * * * *', async () => {
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
        }),
        // CRON job for getting VERIFY status transaction + done face request
        new CronJob('*/30 * * * * *', async () => {
            // get face request without contracts addresses
            const requestIds = await FaceRequestContractRepository.getNotVerifiedRequests();
            if (requestIds.length > 0) {
                for (var i = 0; i < requestIds.length; i++) {
                    const requestRow = requestIds[i];
                    const transaction = requestRow.verifyHash;
                    const receipt = await BlockchainHelper.getTransactionReceipt(transaction);
                    if (receipt) {
                        if (receipt.status) {
                            // get 
                            const faceRequest = await FaceRequest.findOne({
                                where: {
                                    id: requestRow.requestId
                                }
                            });
                            if (faceRequest) {
                                const trancheId = faceRequest.trancheId;
                                const projectId = await ProjectRepository.getProjectIdByRequestId(faceRequest.id);
                                const transaction = receipt.transactionHash;
                                // insert to request transactions
                                const blockHash = receipt.blockHash;
                                await FaceRequestContractRepository.setContractProperty(faceRequest.id, 'verifyReceipt', blockHash);
                                faceRequest.update({ isFreeze: false, successedAt: new Date(), isAuthorised: true });
                                const requestChain = await FaceRequestChain.findOne({
                                    where: {
                                        requestId: requestRow.requestId
                                    },
                                    attributes: ['id', 'verifyAt', 'verifyBy']
                                });
                                requestChain.update({ verifyAt: new Date() });
                                const user = await User.findOne({
                                    where: {
                                        id: requestChain.verifyBy
                                    },
                                    include: [
                                        User.associations.roles,
                                        User.associations.personalData
                                    ]
                                });
                                const project = await Project.findOne({
                                    where: {
                                        id: projectId
                                    }
                                });
                                await ProjectTransaction.update({status: ProjectTransaction.SUCCESS_STATUS}, {
                                    where: {
                                        txHash: transaction
                                    }
                                });
                                event(new FaceRequestDone(user, faceRequest, project));
                            }
                        } else {
                            await ProjectTransaction.update({status: ProjectTransaction.FAILED_STATUS}, {
                                where: {
                                    txHash: transaction
                                }
                            });
                        }
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