import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import ProjectDocument from "../models/projectDocument";
import saveUploadDocsHistory from "../listeners/project/saveUploadDocsHistory";
import generateDocsHash from "../listeners/project/generateDocsHash";

class ProjectDocumentsUploaded extends Event {
    public project: Project;
    public user: User;
    public documents: Array<ProjectDocument>|[];

    constructor(user: User, project: Project, projectDocs: Array<ProjectDocument>|[]) {
        super();
        this.user = user;
        this.project = project;
        this.documents = projectDocs;
    }

    public listeners = [
        saveUploadDocsHistory,
        generateDocsHash
    ];
}

export default ProjectDocumentsUploaded;
