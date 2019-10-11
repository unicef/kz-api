import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceRequestApproved from "../../events/faceRequestApproved";

class SaveApprovedHistory extends Listener {
    public handle = async (event: FaceRequestApproved) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.APPROVE_REQUEST_KEY,
                data: {
                    faceRequestNum: await faceRequest.getNum()
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveApprovedHistory();