import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ActivityRepository from "../../repositories/activityRepository";
import FaceRequestDone from "../../events/faceRequestDone";

class SaveApprovedHistory extends Listener {
    public handle = async (event: FaceRequestDone) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;

        const totalAmounts = await ActivityRepository.getTotalRequestAmounts(faceRequest.id);
        const sendedAmount = totalAmounts.totalF;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.DONE_REQUEST_KEY,
                data: {
                    faceRequestNum: await faceRequest.getNum(),
                    transactionAmount: sendedAmount
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveApprovedHistory();