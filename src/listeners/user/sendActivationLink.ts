import Listener from "../listener";
import UserRegistered from "../../events/userRegistered";
import ActivationLinkMail from "../../mails/activationLinkMail";


class SendActivationLink extends Listener {
    public handle = async (event: UserRegistered) => {
        let mail = new ActivationLinkMail(event.user);
        mail.send();

        return ;
    }
}

export default new SendActivationLink();