import Listener from "../listener";
import ProjectWasCreated from "../../events/projectWasCreated";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";

class SaveCreateHistory extends Listener {
    public handle = async (event: ProjectWasCreated) => {
        const user = event.user;
        const project = event.project;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.CREATE_EVENT_KEY,
                data: {
                    titleEn: project.titleEn,
                    titleRu: project.titleRu,
                    officerId: project.officerId
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveCreateHistory();