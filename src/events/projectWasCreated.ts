import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveCreateHistory from "../listeners/project/saveCreateHistory";
import sendProjectCreatedMail from "../listeners/project/sendProjectCreatedMail";

class ProjectWasCreated extends Event {
    public project: Project;
    public user: User;

    constructor(user: User, project: Project) {
        super();
        this.user = user;
        this.project = project;
    }

    public listeners = [
        saveCreateHistory,
        sendProjectCreatedMail
    ];
}

export default ProjectWasCreated;
