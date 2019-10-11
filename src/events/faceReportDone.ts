import Event from "./event";
import User from "../models/user";
import Project from "../models/project";
import saveDoneHistory from "../listeners/faceReport/saveDoneHistory";
import sendDoneRequestMails from "../listeners/faceRequest/sendDoneRequestMails";
import FaceReport from "../models/faceReport";

class FaceReportDone extends Event {
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
        saveDoneHistory,
        // send email
        //sendDoneRequestMails
    ];
}

export default FaceReportDone;
