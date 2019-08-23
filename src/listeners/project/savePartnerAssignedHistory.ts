import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectPartnerAssigned from "../../events/projectPartnerAssigned";

class SavePartnerAssignedHistory extends Listener {
    public handle = async (event: ProjectPartnerAssigned) => {
        const user = event.user;
        const project = event.project;
        const partner = event.partner;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.SET_IP_EVENT_KEY,
                data: {
                    patnerId: partner.id
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SavePartnerAssignedHistory();