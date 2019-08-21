import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";
import Partner from "../models/partner";

class ProjectPartnerAssignedUnicef extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User, project: Project, partner: Partner) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = user.email;
        this.subject = "IP allready assigned into project";
        this.template = 'projectPartnerAssigned';

        this.mailData = {
            user: user,
            project: project,
            partner: partner
        };
    }
}

export default ProjectPartnerAssignedUnicef;