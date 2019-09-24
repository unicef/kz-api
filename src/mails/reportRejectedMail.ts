import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";
import iInputReportActivity from "../interfaces/faceReport/iInputReportActivity";

class ReportRejectedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (toEmail: string, user: User, project: Project, faceReportNum: number, activities: Array<iInputReportActivity>) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = toEmail;
        this.subject = "Report was rejected";
        this.template = 'reportRejected';

        this.mailData = {
            user: user,
            project: project,
            faceReport: faceReportNum,
            activities: activities
        };
    }
}

export default ReportRejectedMail;