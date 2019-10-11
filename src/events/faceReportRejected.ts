import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveRejectedHistory from "../listeners/faceReport/saveRejectedHistory";
import FaceReport from "../models/faceReport";
import sendReportRejectedEmail from "../listeners/faceReport/sendReportRejectedEmail";
import iInputReportActivity from "../interfaces/faceReport/iInputReportActivity";

class FaceReportRejected extends Event {
    public project: Project;
    public user: User;
    public faceReport: FaceReport;
    public rejectedActivities: Array<iInputReportActivity>;

    constructor(user: User, faceReport: FaceReport, project: Project, rejectedActivities: Array<iInputReportActivity>) {
        super();
        this.user = user;
        this.faceReport = faceReport;
        this.project = project;
        this.rejectedActivities = rejectedActivities;
    }

    public listeners = [
        // save in history
        saveRejectedHistory,
        // send reject email
        sendReportRejectedEmail
    ];
}

export default FaceReportRejected;
