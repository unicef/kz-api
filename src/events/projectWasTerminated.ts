import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveTerminateHistory from "../listeners/project/saveTerminateHistory";

class ProjectWasTerminated extends Event {
    public project: Project;
    public user: User;

    constructor(user: User, project: Project) {
        super();
        this.user = user;
        this.project = project;
    }

    public listeners = [
        saveTerminateHistory
    ];
}

export default ProjectWasTerminated;
