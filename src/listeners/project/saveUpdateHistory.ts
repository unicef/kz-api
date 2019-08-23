import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ProjectWasUpdated from "../../events/projectWasUpdated";

class SaveUpdateHistory extends Listener {
    public handle = async (event: ProjectWasUpdated) => {
        const user = event.user;
        const project = event.project;
        const oldValues = event.oldValues;
        const newValues = event.newValues;
        const fields = event.fields;

        let updatedData: Array<object>|[] = [];

        if (fields) {
            fields.forEach((field) => {
                if (field !== 'updatedAt') {
                    switch (field) {
                        case 'ice': 
                            if (parseFloat(oldValues[field]) !== newValues[field]) {
                                updatedData.push({
                                    field: field,
                                    oldVal: oldValues[field],
                                    newVal: newValues[field]
                                })
                            }
                            break;
                        case 'usdRate': 
                            if (parseFloat(oldValues[field]) !== newValues[field]) {
                                updatedData.push({
                                    field: field,
                                    oldVal: oldValues[field],
                                    newVal: newValues[field]
                                })
                            }
                            break;
                        default:
                            updatedData.push({
                                field: field,
                                oldVal: oldValues[field],
                                newVal: newValues[field]
                            })
                        break;
                    }
                }
            })
    
            if (updatedData.length > 0) {
                const historyData = {
                    userId: user.id,
                    projectId: project.id,
                    event: {
                        action: ProjectHistoryHelper.EDIT_EVENT_KEY,
                        data: {
                            fields: updatedData
                        }
                    }
                }

                console.log("HISTORY RECORD!!!!", historyData);
    
                const historyRecord = await HistoryRepository.create(historyData);
            }
        }
    }
}

export default new SaveUpdateHistory();