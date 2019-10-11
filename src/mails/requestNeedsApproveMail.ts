import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";

class RequestNeedsApproveMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (toEmail: string, user: User, project: Project, faceRequestNum: number) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = toEmail;
        this.subject = "FACE request needs your approve";
        this.template = 'requestNeedsApprove';

        this.mailData = {
            user: user,
            project: project,
            faceRequest: faceRequestNum
        };
    }
}

export default RequestNeedsApproveMail;