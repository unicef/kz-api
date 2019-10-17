import Listener from "../listener";
import ProjectCreatedMail from "../../mails/projectCreatedMail";
import ProjectOfficerAssignedMail from "../../mails/projectOfficerAssignedMail";
import User from "../../models/user";
import ProjectPartnerAssigned from "../../events/projectPartnerAssigned";
import ProjectPartnerAssignedUnicef from "../../mails/projectPartnerAssignedUnicef";
import ProjectPartnerAssignedAssist from "../../mails/projectPartnerAssignedAssist";


class SendPartnerAssignedEmail extends Listener {
    public handle = async (event: ProjectPartnerAssigned) => {
        const project = event.project;
        const partner = event.partner;
        const coordinator = await User.findOne({
            where: {
                id: project.officerId
            }
        });
        if (coordinator) {
            // success partner assigned
            let coordinatorEmail = new ProjectPartnerAssignedUnicef(coordinator, project, partner);
            coordinatorEmail.send();
        }

        
        // set as responsible officer
        const assistantId = await partner.getAssistId();
        const assistant = await User.findOne({
            where: {
                id: assistantId
            }
        });
        if (assistant) {
            let assistMail = new ProjectPartnerAssignedAssist(assistant, project);
            assistMail.send();
        }
        
        return ;
    }
}

export default new SendPartnerAssignedEmail();