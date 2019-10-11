import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import createConfirmChainRow from "../listeners/faceReport/createConfirmChainRow";
import saveCreatedHistory from "../listeners/faceReport/saveCreatedHistory";
import sendReportNeedsApproveEmail from "../listeners/faceReport/sendReportNeedsApproveEmail";
import FaceReport from "../models/faceReport";

class FaceReportCreated extends Event {
    public project: Project;
    public user: User;
    public faceReport: FaceReport;

    constructor(user: User, faceReport: FaceReport, project: Project) {
        super();
        this.user = user;
        this.faceReport = faceReport;
        this.project = project;
        
    }

    public listeners = [
        // create report confirm chain data
        createConfirmChainRow,
        // save in history
        saveCreatedHistory,
        // send email to authorised person
        sendReportNeedsApproveEmail
    ];
}

export default FaceReportCreated;
