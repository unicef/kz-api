import Event from "./event";
import User from "../models/user";
import SendActivationLink from "../listeners/user/sendActivationLink";
import createUserWallet from "../listeners/user/createUserWallet";
import Listener from "../listeners/listener";

class UserRegistered extends Event {
    public user: User;
    public password: string;

    constructor(user: User, password: string) {
        super();
        this.user = user;
        this.password = password;
    }

    public listeners: Array<Listener> = [
        SendActivationLink,
        createUserWallet
    ];
}

export default UserRegistered;
