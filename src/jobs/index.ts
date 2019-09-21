import { CronJob } from "cron";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";
import BlockchainHelper from "../helpers/blockchainHelper";
import FaceRequest from "../models/faceRequest";
import BlockchainController from "../controllers/blockchainController";

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
        })
    ];

    constructor () {
        this.jobs.forEach((job) => {
            job.start();
        })
    }
}

export default Jobs;