import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import saveDoneHistory from "../listeners/faceRequest/saveDoneHistory";
import sendDoneRequestMails from "../listeners/faceRequest/sendDoneRequestMails";

class FaceRequestDone extends Event {
    public project: Project;
    public user: User;
    public faceRequest: FaceRequest;

    constructor(user: User, faceRequest: FaceRequest, project: Project) {
        super();
        this.user = user;
        this.faceRequest = faceRequest;
        this.project = project;
    }

    public listeners = [
        // save in history
        saveDoneHistory,
        // send email
        sendDoneRequestMails
    ];
}

export default FaceRequestDone;
