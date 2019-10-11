import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Project from "../models/project";
import FaceRequest from "../models/faceRequest";
import iInputActivity from "../interfaces/faceRequest/iInputActivity";

class RequestRejectedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (toEmail: string, user: User, project: Project, faceRequestNum: number, activities: Array<iInputActivity>) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = toEmail;
        this.subject = "Request was rejected";
        this.template = 'requestRejected';

        this.mailData = {
            user: user,
            project: project,
            faceRequest: faceRequestNum,
            activities: activities
        };
    }
}

export default RequestRejectedMail;