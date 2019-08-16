import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";
import UserNotfind from "../exceptions/userNotFind";

class ProjectOfficerAssignedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User, project: Project) {
        super();
        User.findByPk(project.officerId).then((officer) => {
            if (officer) {
                this.from = Config.get("MAIL_FROM", 'noreply@local.com');
                this.to = officer.email;
                this.subject = "You are assigned to the project";
                this.template = 'projectOfficerAssigned';
        
                this.mailData = {
                    user: officer,
                    project: project
                };
            } else {
                throw new Error('Officer not found(')
            }
        })
    }
}

export default ProjectOfficerAssignedMail;