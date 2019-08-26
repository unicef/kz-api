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
            console.log("FIELD:::: LISTENER", field);
            const oldValue = project.getDataValue(field);
            console.log("OLD VALUE:!!!!!", oldValue);
            console.log("NEW VALUE!!!!!::::", newProjectData[field]);
            if (oldValue && oldValue != newProjectData[field]) {
                updatedData.push({
                    field: field,
                    oldVal: oldValue,
                    newVal: newProjectData[field]
                })
            }
        }


        console.log("UPDATED DATA!@@@", updatedData);

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