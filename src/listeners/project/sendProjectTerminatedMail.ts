import Listener from "../listener";
import User from "../../models/user";
import ProjectWasTerminated from "../../events/projectWasTerminated";
import ProjectTerminatedMail from "../../mails/projectTerminatedMail";
import Partner from "../../models/partner";


class SendProjectTerminatedMail extends Listener {
    public handle = async (event: ProjectWasTerminated) => {
        const project = event.project;

        const officer = await User.findByPk(project.officerId);
        if (officer) {
            let officerEmail = new ProjectTerminatedMail(officer, project, event.terminationReason);
            officerEmail.send();
        }
        if (project.partnerId) {
            const partner = await Partner.findByPk(project.partnerId);
            if (partner && partner.assistId) {
                const assist = await User.findByPk(partner.assistId);
                if (assist) {
                    let assistEmail = new ProjectTerminatedMail(assist, project, event.terminationReason);
                    assistEmail.send();
                }
            }
        }

        return ;
    }
}

export default new SendProjectTerminatedMail();