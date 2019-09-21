import Event from "./event";
import User from "../models/user";
import saveCreateHistory from "../listeners/project/saveCreateHistory";
import iWallet from "../interfaces/user/iWallet";
import giveTestGas from "../listeners/user/giveTestGas";

class UserWalletCreated extends Event {
    public user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    public listeners = [
        giveTestGas
    ];
}

export default UserWalletCreated;
