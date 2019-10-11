import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceReportUpdated from "../../events/faceReportUpdated";

class SaveUpdatedHistory extends Listener {
    public handle = async (event: FaceReportUpdated) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.UPDATE_REPORT_KEY,
                data: {
                    id: faceReport.id
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveUpdatedHistory();