import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";

class RequestApprovedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (toEmail: string, user: User, project: Project, faceRequestNum: number) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = toEmail;
        this.subject = "FACE request was successfully approved";
        this.template = 'requestApproved';

        this.mailData = {
            user: user,
            project: project,
            faceRequest: faceRequestNum
        };
    }
}

export default RequestApprovedMail;