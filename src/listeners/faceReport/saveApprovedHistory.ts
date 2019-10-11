import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceReportApproved from "../../events/faceReportApproved";

class SaveApprovedHistory extends Listener {
    public handle = async (event: FaceReportApproved) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.APPROVE_REPORT_KEY,
                data: {
                    faceRequestNum: await faceReport.getNum()
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveApprovedHistory();