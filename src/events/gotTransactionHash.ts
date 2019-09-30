import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import saveUpdatedHistory from "../listeners/faceRequest/saveUpdatedHistory";
import sendRequestNeedsApproveEmail from "../listeners/faceRequest/sendRequestNeedsApproveEmail";
import createProjectTransactionRaw from "../listeners/faceRequest/createProjectTransactionRaw";

class GotTransactionHash extends Event {
    public requestId: number;
    public hash: string;
    public requestStatus: string;

    constructor(requestId: number, hash: string, requestStatus: string) {
        super();
        this.requestId = requestId;
        this.hash = hash;
        this.requestStatus = requestStatus;
    }

    public listeners = [
        // create project transaction row
        createProjectTransactionRaw
    ];
}

export default GotTransactionHash;
