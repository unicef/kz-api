import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";

class ReportNeedsApproveMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (toEmail: string, user: User, project: Project, faceReportNum: number) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = toEmail;
        this.subject = "FACE report needs your approval";
        this.template = 'reportNeedsApprove';

        this.mailData = {
            user: user,
            project: project,
            faceReport: faceReportNum
        };
        console.log("REPORT NEEDS APPROVE EMAIL!!!", this.mailData);
    }
}

export default ReportNeedsApproveMail;