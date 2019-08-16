import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectDocumentsUploaded from "../../events/projectDocumentsUploaded";

class SaveUploadDocsHistory extends Listener {
    public handle = async (event: ProjectDocumentsUploaded) => {
        const user = event.user;
        const project = event.project;
        const docs = event.documents;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.UPLOAD_DOCS_EVENT_KEY,
                data: {
                    docs: docs,
                }
            }
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveUploadDocsHistory();