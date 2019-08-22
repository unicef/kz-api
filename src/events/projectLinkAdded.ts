import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import ProjectTranche from "../models/projectTranche";
import saveTranchesInstalledHistory from "../listeners/project/saveTranchesInstalledHistory";
import ProjectLink from "../models/projectLink";
import saveLinkAddedHistory from "../listeners/project/saveLinkAddedHistory";

class ProjectLinkAdded extends Event {
    public project: Project;
    public user: User;
    public link: ProjectLink;

    constructor(user: User, project: Project, link: ProjectLink) {
        super();
        this.user = user;
        this.project = project;
        this.link = link;
    }

    public listeners = [
        saveLinkAddedHistory
    ];
}

export default ProjectLinkAdded;
