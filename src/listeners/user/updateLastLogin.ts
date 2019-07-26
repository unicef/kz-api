import Listener from "../listener";
import UserLoggedIn from "../../events/userLoggedIn";


class UpdateLastLogin extends Listener {
    public handle = async (event: UserLoggedIn) => {
        event.user.lastLogin = new Date();
        event.user.save();

        return ;
    }
}

export default new UpdateLastLogin();