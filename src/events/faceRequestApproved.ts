import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import sendRequestNeedsApproveEmail from "../listeners/faceRequest/sendRequestNeedsApproveEmail";
import saveApprovedHistory from "../listeners/faceRequest/saveApprovedHistory";

class FaceRequestApproved extends Event {
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
        saveApprovedHistory,
        // send reject email
        sendRequestNeedsApproveEmail
    ];
}

export default FaceRequestApproved;
