import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectPartnerAssigned from "../../events/projectPartnerAssigned";
import ProjectLinkAdded from "../../events/projectLinkAdded";

class SaveLinkAddedHistory extends Listener {
    public handle = async (event: ProjectLinkAdded) => {
        const user = event.user;
        const project = event.project;
        const link = event.link;

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.ADD_LINK_EVENT_KEY,
                data: {
                    link: link
                }
            }
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveLinkAddedHistory();