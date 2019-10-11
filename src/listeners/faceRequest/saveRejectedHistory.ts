import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import FaceRequestRejected from "../../events/faceRequestRejected";
import Role from "../../models/role";

class SaveRejectedHistory extends Listener {
    public handle = async (event: FaceRequestRejected) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;
        const activities = event.rejectedActivities;

        if (!user.hasRole(Role.partnerAuthorisedId)) {
            const historyData = {
                userId: user.id,
                projectId: project.id,
                event: {
                    action: ProjectHistoryHelper.REJECT_REQUEST_KEY,
                    data: {
                        faceRequestNum: await faceRequest.getNum(),
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
}

export default new SaveRejectedHistory();