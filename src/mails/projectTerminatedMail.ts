import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";

class ProjectTerminatedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User, project: Project) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = user.email;
        this.subject = "Project was terminated";
        this.template = 'projectTerminated';

        this.mailData = {
            user: user,
            project: project
        };
    }
}

export default ProjectTerminatedMail;