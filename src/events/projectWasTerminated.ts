import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveTerminateHistory from "../listeners/project/saveTerminateHistory";
import sendProjectTerminatedMail from "../listeners/project/sendProjectTerminatedMail";
import ProjectHelper from "../helpers/projectHelper";

class ProjectWasTerminated extends Event {
    public project: Project;
    public user: User;
    public terminationReason: string|null;
    public terminationReasonKey: string;


    constructor(user: User, project: Project, terminationKey: string) {
        super();
        this.user = user;
        this.project = project;
        this.terminationReasonKey = terminationKey;
        this.terminationReason = ProjectHelper.getTerminationReasonTitle(terminationKey);
    }

    public listeners = [
        saveTerminateHistory,
        sendProjectTerminatedMail
    ];
}

export default ProjectWasTerminated;
