import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import ProjectDocument from "../models/projectDocument";
import saveDeleteDocHistory from "../listeners/project/saveDeleteDocHistory";

class ProjectDocumentDeleted extends Event {
    public project: Project;
    public user: User;
    public document: ProjectDocument;

    constructor(user: User, project: Project, projectDoc: ProjectDocument) {
        super();
        this.user = user;
        this.project = project;
        this.document = projectDoc;
    }

    public listeners = [
        saveDeleteDocHistory
    ];
}

export default ProjectDocumentDeleted;
