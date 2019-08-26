import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveCreateHistory from "../listeners/project/saveCreateHistory";
import sendProjectCreatedMail from "../listeners/project/sendProjectCreatedMail";
import saveUpdateHistory from "../listeners/project/saveUpdateHistory";

class ProjectWasUpdated extends Event {
    public project: Project;
    public user: User;
    public newProjectData: any;

    constructor(user: User, project: Project, newProjectData) {
        super();
        this.user = user;
        this.project = project;
        this.newProjectData = newProjectData;
    }

    public listeners = [
        saveUpdateHistory,
    ];
}

export default ProjectWasUpdated;
