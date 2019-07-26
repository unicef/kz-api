import Listener from "../listener";
import UserRegisteredRemotely from "../../events/userRegisteredRemotely";
import SetManualPasswordLink from "../../mails/setManualPasswordLink";


class SendSetManualPasswordLink extends Listener {
    public handle = async (event: UserRegisteredRemotely) => {
        let mail = new SetManualPasswordLink(event.user);
        mail.send();

        return ;
    }
}

export default new SendSetManualPasswordLink();