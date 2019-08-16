import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";

// Sending activation link to User email
class ActivationLinkMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = user.email;
        this.subject = "Hello! ✔ ACTIVATION link here";
        this.template = "activationLink";

        this.mailData = {
            activationLink: user.getActivationLink()
        };
    }
}

export default ActivationLinkMail;