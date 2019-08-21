import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import sendProjectCreatedMail from "../listeners/project/sendProjectCreatedMail";
import Partner from "../models/partner";
import savePartnerAssignedHistory from "../listeners/project/savePartnerAssignedHistory";
import sendPartnerAssignedEmail from "../listeners/project/sendPartnerAssignedEmail";

class ProjectPartnerAssigned extends Event {
    public project: Project;
    public user: User;
    public partner: Partner;

    constructor(user: User, project: Project, partner: Partner) {
        super();
        this.user = user;
        this.project = project;
        this.partner = partner;
    }

    public listeners = [
        savePartnerAssignedHistory,
        sendPartnerAssignedEmail
    ];
}

export default ProjectPartnerAssigned;
