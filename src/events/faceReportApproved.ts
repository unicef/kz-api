import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import sendReportNeedsApproveEmail from "../listeners/faceReport/sendReportNeedsApproveEmail";
import saveApprovedHistory from "../listeners/faceReport/saveApprovedHistory";
import FaceReport from "../models/faceReport";

class FaceReportApproved extends Event {
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
        // save in history
        saveApprovedHistory,
        // send reject email
        sendReportNeedsApproveEmail
    ];
}

export default FaceReportApproved;
