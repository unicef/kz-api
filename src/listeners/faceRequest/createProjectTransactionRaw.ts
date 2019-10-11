import Listener from "../listener";
import GotTransactionHash from "../../events/gotTransactionHash";
import ProjectRepository from "../../repositories/projectRepository";
import FaceRequestRepository from "../../repositories/faceRequestRepository";
import ProjectTransaction from "../../models/projectTransaction";
import FaceRequest from "../../models/faceRequest";

class CreateProjectTransactionRaw extends Listener {
    public handle = async (event: GotTransactionHash) => {
        const requestId = event.requestId;
        const hash = event.hash;
        const requestStatus = event.requestStatus;

        if (requestStatus === FaceRequest.VERIFY_STATUS_KEY) {
            const projectId = await ProjectRepository.getProjectIdByRequestId(requestId);
            // get transaction amount
            const requestTransactionAmount = await FaceRequestRepository.getTransactionAmountByReqId(requestId);
            // add project transaction
            let projectTransaction = {
                projectId: projectId,
                txHash: hash,
                amount: requestTransactionAmount,
                type: ProjectTransaction.OUTCOME_TYPE,
                status: ProjectTransaction.PENDING_STATUS
            }
            await ProjectTransaction.create(projectTransaction);
        }
    }
}

export default new CreateProjectTransactionRaw();