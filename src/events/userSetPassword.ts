import Event from "./event";
import User from "../models/user";
import createUserWallet from "../listeners/user/createUserWallet";

class UserSetPassword extends Event {
    public user: User;
    public password: string;

    constructor(user: User, password: string) {
        super();
        this.user = user;
        this.password = password;
    }

    public listeners = [
        createUserWallet
    ];
}

export default UserSetPassword;
