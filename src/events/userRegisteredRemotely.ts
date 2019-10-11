import Event from "./event";
import User from "../models/user";
import sendSetManualPasswordLink from "../listeners/user/sendSetManualPasswordLink";

class UserRegisteredRemotely extends Event {
    public user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    public listeners = [
        sendSetManualPasswordLink
    ];
}

export default UserRegisteredRemotely;
