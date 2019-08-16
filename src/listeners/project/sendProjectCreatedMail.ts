import Listener from "../listener";
import ProjectWasCreated from "../../events/projectWasCreated";
import ProjectCreatedMail from "../../mails/projectCreatedMail";
import ProjectOfficerAssignedMail from "../../mails/projectOfficerAssignedMail";


class SendProjectCreatedMail extends Listener {
    public handle = async (event: ProjectWasCreated) => {
        const project = event.project;
        const user = event.user;

        // success creating project
        let createMail = new ProjectCreatedMail(user, project);
        createMail.send();
        
        // set as responsible officer
        let officerMail = new ProjectOfficerAssignedMail(user, project);
        officerMail.send();
        
        return ;
    }
}

export default new SendProjectCreatedMail();