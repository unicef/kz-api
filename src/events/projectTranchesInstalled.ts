import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import ProjectTranche from "../models/projectTranche";
import saveTranchesInstalledHistory from "../listeners/project/saveTranchesInstalledHistory";

class ProjectTranchesInstalled extends Event {
    public project: Project;
    public user: User;
    public tranches: Array<ProjectTranche>;

    constructor(user: User, project: Project, tranches: Array<ProjectTranche>) {
        super();
        this.user = user;
        this.project = project;
        this.tranches = tranches;
    }

    public listeners = [
        saveTranchesInstalledHistory
    ];
}

export default ProjectTranchesInstalled;
