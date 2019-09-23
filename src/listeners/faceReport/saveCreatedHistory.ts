import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceReportCreated from "../../events/faceReportCreated";

class SaveCreatedHistory extends Listener {
    public handle = async (event: FaceReportCreated) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.CREATE_REPORT_KEY,
                data: {
                    from: faceReport.from,
                    to: faceReport.to
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveCreatedHistory();