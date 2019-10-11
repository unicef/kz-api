import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import saveUpdatedHistory from "../listeners/faceRequest/saveUpdatedHistory";
import sendRequestNeedsApproveEmail from "../listeners/faceRequest/sendRequestNeedsApproveEmail";

class FaceRequestUpdated extends Event {
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
        saveUpdatedHistory,
        // send email to authorised person
        sendRequestNeedsApproveEmail
    ];
}

export default FaceRequestUpdated;
