import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectDocumentsUploaded from "../../events/projectDocumentsUploaded";

class SaveUploadDocsHistory extends Listener {
    public handle = async (event: ProjectDocumentsUploaded) => {
        const userId = event.userId;
        const project = event.project;
        const doc = event.document;

        const historyData = {
            userId: userId,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.UPLOAD_DOCS_EVENT_KEY,
                data: {
                    doc: doc,
                }
            }
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveUploadDocsHistory();