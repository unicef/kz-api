import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import FaceReport from "../models/faceReport";
import sendReportNeedsApproveEmail from "../listeners/faceReport/sendReportNeedsApproveEmail";
import saveUpdatedHistory from "../listeners/faceReport/saveUpdatedHistory";

class FaceReportUpdated extends Event {
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
        saveUpdatedHistory,
        // send email to authorised person
        sendReportNeedsApproveEmail
    ];
}

export default FaceReportUpdated;
