import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectWasUpdated from "../../events/projectWasUpdated";

class SaveUpdateHistory extends Listener {
    public handle = async (event: ProjectWasUpdated) => {
        const user = event.user;
        const project = event.project;
        const newProjectData = event.newProjectData;

        let updatedData: Array<object> | [] = [];

        for (var field in newProjectData) {
            const oldValue = project.getDataValue(field);
            if (oldValue && oldValue != newProjectData[field]) {
                if (field!=='deadline') {
                    updatedData.push({
                        field: field,
                        oldVal: oldValue,
                        newVal: newProjectData[field]
                    })
                } else {
                    if (oldValue.toLocaleString('ru-Ru', { timeZone: 'UTC' }) !== newProjectData[field].toLocaleString('ru-Ru', { timeZone: 'UTC' }) ) {
                        updatedData.push({
                            field: field,
                            oldVal: oldValue,
                            newVal: newProjectData[field]
                        })
                    }
                }
            }
        }

        if (updatedData.length > 0) {
            const historyData = {
                userId: user.id,
                projectId: project.id,
                event: {
                    action: ProjectHistoryHelper.EDIT_EVENT_KEY,
                    data: {
                        fields: updatedData
                    }
                },
                createdAt: new Date()
            }

            const historyRecord = await HistoryRepository.create(historyData);
        }
    }
}

export default new SaveUpdateHistory();