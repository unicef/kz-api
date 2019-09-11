import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceRequestCreated from "../../events/faceRequestCreated";

class SaveCreatedHistory extends Listener {
    public handle = async (event: FaceRequestCreated) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.CREATE_REQUEST_KEY,
                data: {
                    from: faceRequest.from,
                    to: faceRequest.to
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveCreatedHistory();