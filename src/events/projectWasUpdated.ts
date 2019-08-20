import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveCreateHistory from "../listeners/project/saveCreateHistory";
import sendProjectCreatedMail from "../listeners/project/sendProjectCreatedMail";
import saveUpdateHistory from "../listeners/project/saveUpdateHistory";

class ProjectWasUpdated extends Event {
    public project: Project;
    public user: User;
    public oldValues: Project;
    public newValues: Project;
    public fields: Array<string>;

    constructor(user: User, project: Project, oldProjectValues: Project, newProjectValues: Project, fields: Array<string>) {
        super();
        this.user = user;
        this.project = project;
        this.oldValues = oldProjectValues;
        this.newValues = newProjectValues;
        this.fields = fields;
    }

    public listeners = [
        saveUpdateHistory,
    ];
}

export default ProjectWasUpdated;
