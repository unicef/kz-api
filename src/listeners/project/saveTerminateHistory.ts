import Listener from "../listener";
import ProjectWasCreated from "../../events/projectWasCreated";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectWasTerminated from "../../events/projectWasTerminated";

class SaveTerminateHistory extends Listener {
    public handle = async (event: ProjectWasTerminated) => {
        const user = event.user;
        const project = event.project;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.SET_TERMINATED_STATUS
            }
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveTerminateHistory();