import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectTranchesInstalled from "../../events/projectTranchesInstalled";
import ProjectTranche from "../../models/projectTranche";

class SaveTranchesInstalledHistory extends Listener {
    public handle = async (event: ProjectTranchesInstalled) => {
        const user = event.user;
        const project = event.project;
        const tranches = event.tranches;
        let tranchesHistoryData: any = [];

        tranches.forEach((tranche: ProjectTranche) => {
            tranchesHistoryData.push({
                num: tranche.num,
                from: tranche.from.toISOString().slice(0,10),
                to: tranche.to.toISOString().slice(0,10),
                amount: parseFloat(tranche.amount)
            });
        })

        const historyData = {
            userId: user.id,
            projectId: project.id,
            event: {
                action: ProjectHistoryHelper.SET_TRANCHES_EVENT_KEY,
                data: {
                    tranches: tranchesHistoryData
                }
            },
            createdAt: new Date()
        }

        const historyRecord = await HistoryRepository.create(historyData);
    }
}

export default new SaveTranchesInstalledHistory();