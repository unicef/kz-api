import Listener from "../listener";
import ProjectWasCreated from "../../events/projectWasCreated";
import ProjectCreatedMail from "../../mails/projectCreatedMail";
import ProjectOfficerAssignedMail from "../../mails/projectOfficerAssignedMail";
import User from "../../models/user";


class SendProjectCreatedMail extends Listener {
    public handle = async (event: ProjectWasCreated) => {
        const project = event.project;
        const user = event.user;

        // success creating project
        let createMail = new ProjectCreatedMail(user, project);
        createMail.send();
        
        // set as responsible officer
        const officer = await User.findByPk(project.officerId);
        if (officer) {
            let officerMail = new ProjectOfficerAssignedMail(officer, project);
            officerMail.send();
        }
        
        return ;
    }
}

export default new SendProjectCreatedMail();