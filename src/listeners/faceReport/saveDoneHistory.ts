import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceReportDone from "../../events/faceReportDone";

class SaveApprovedHistory extends Listener {
    public handle = async (event: FaceReportDone) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.DONE_REPORT_KEY,
                data: {
                    faceRequestNum: await faceReport.getNum(),
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveApprovedHistory();