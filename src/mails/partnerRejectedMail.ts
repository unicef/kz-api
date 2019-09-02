import User from "../models/user";
import Config from "../services/config";
import Mail from "./mail";
import Partner from "../models/partner";

class PartnerRejectedMail extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User, partner: Partner, rejectReason: string) {
        super();
        this.from = Config.get("MAIL_FROM", 'noreply@local.com');
        this.to = user.email;
        this.subject = "Your company was rejected";
        this.template = 'partnerRejected';

        this.mailData = {
            user: user,
            partner: partner,
            reason: rejectReason
        };
    }
}

export default PartnerRejectedMail;