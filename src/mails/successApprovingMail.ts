import User from "../models/user";
import config from "../config/config";
import Mail from "./mail";
import Partner from "../models/partner";

// Sending activation link to User email
class SuccessApprovingMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User, partner: Partner) {
        super();
        this.from = config.mail.from;
        this.to = user.email;
        this.subject = "Hello! ✔ Your company was approved";
        this.template = 'successPartnerApproving';

        this.mailData = {
            user: user,
            partner: partner
        };
    }
}

export default SuccessApprovingMail;