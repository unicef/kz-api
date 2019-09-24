import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceReportRejected from "../../events/faceReportRejected";

class SaveRejectedHistory extends Listener {
    public handle = async (event: FaceReportRejected) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;
        const activities = event.rejectedActivities;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.REJECT_REQUEST_KEY,
                data: {
                    faceRequestNum: await faceReport.getNum(),
                    activities: activities.map((activity) => {
                        let act = {
                            title: activity.title,
                            reason: activity.rejectReason
                        }

                        return act;
                    })
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveRejectedHistory();