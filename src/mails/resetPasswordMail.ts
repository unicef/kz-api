import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";

// Sending activation link to User email
class ResetPasswordMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = user.email;
        this.subject = "Here's the reset password link";
        this.template = 'resetPasswordLink';

        this.mailData = {
            passwordLink: user.generateManualPasswordHash()
        };
    }
}

export default ResetPasswordMail;