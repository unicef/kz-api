import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectDocumentDeleted from "../../events/projectDocumentDeleted";

class SaveDeleteDocHistory extends Listener {
    public handle = async (event: ProjectDocumentDeleted) => {
        const user = event.user;
        const project = event.project;
        const doc = event.document;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.DELETE_DOC_EVENT_KEY,
                data: {
                    doc: doc.toJSON(),
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveDeleteDocHistory();