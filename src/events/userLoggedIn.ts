import Event from "./event";
import User from "../models/user";
import updateLastLogin from "../listeners/user/updateLastLogin";

class UserLoggedIn extends Event {
    public user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    public listeners = [
        updateLastLogin
    ];
}

export default UserLoggedIn;
