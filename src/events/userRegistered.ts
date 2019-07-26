import Event from "./event";
import User from "../models/user";
import SendActivationLink from "../listeners/user/sendActivationLink";
import createUserPersonalDataRow from "../listeners/user/createUserPersonalDataRow";

class UserRegistered extends Event {
    public user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    public listeners = [
        SendActivationLink,
        createUserPersonalDataRow,
    ];
}

export default UserRegistered;
