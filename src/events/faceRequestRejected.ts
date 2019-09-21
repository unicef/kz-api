import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import Partner from "../models/partner";
import createConfirmChainRow from "../listeners/faceRequest/createConfirmChainRow";
import iInputActivity from "../interfaces/faceRequest/iInputActivity";
import saveRejectedHistory from "../listeners/faceRequest/saveRejectedHistory";
import sendRequestRejectedEmail from "../listeners/faceRequest/sendRequestRejectedEmail";

class FaceRequestRejected extends Event {
    public project: Project;
    public user: User;
    public faceRequest: FaceRequest;
    public rejectedActivities: Array<iInputActivity>;

    constructor(user: User, faceRequest: FaceRequest, project: Project, rejectedActivities: Array<iInputActivity>) {
        super();
        this.user = user;
        this.faceRequest = faceRequest;
        this.project = project;
        this.rejectedActivities = rejectedActivities;
    }

    public listeners = [
        // save in history
        saveRejectedHistory,
        // send reject email
        sendRequestRejectedEmail
    ];
}

export default FaceRequestRejected;
