import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import ProjectDocument from "../models/projectDocument";
import saveUploadDocsHistory from "../listeners/project/saveUploadDocsHistory";
import generateDocsHash from "../listeners/project/generateDocsHash";

class ProjectDocumentsUploaded extends Event {
    public project: Project;
    public userId: number;
    public document: ProjectDocument;

    constructor(userId: number, project: Project, projectDoc: ProjectDocument) {
        super();
        this.userId= userId;
        this.project = project;
        this.document = projectDoc;
        console.log("Document Upload Event SUCCESSSSSQ!!!!!!");
    }

    public listeners = [
        saveUploadDocsHistory,
        generateDocsHash
    ];
}

export default ProjectDocumentsUploaded;
