import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import Partner from "../models/partner";
import createConfirmChainRow from "../listeners/faceRequest/createConfirmChainRow";

class FaceRequestCreated extends Event {
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
        // create request confirm chain data
        createConfirmChainRow,
        // send email to authorised person
        
    ];
}

export default FaceRequestCreated;
