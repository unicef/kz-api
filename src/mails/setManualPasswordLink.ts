import User from "../models/user";
import config from "../config/config";
import Mail from "./mail";

// Sending activation link to User email
class SetManualPasswordLink extends Mail {
    public from?:string;
    public to?:string;
    public subject?:string;
    public template?:string;
    public mailData?: any;

    constructor (user: User) {
        super();
        this.from = config.mail.from;
        this.to = user.email;
        this.subject = "Hello! ✔ You was registered on USCIP system. Only one step left";
        this.template = 'setManualPasswordLink';

        this.mailData = {
            passwordLink: user.generateManualPasswordHash()
        };
    }
}

export default SetManualPasswordLink;