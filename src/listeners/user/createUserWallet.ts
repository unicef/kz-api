import { keystore } from "eth-lightwallet";
import sequelize from "../../services/sequelize";
import { QueryTypes } from "sequelize";
import CryptoJS from "crypto-js";
import Listener from "../listener";
import UserRegistered from "../../events/userRegistered";
import UserSetPassword from "../../events/userSetPassword";
import WalletHelper from "../../helpers/walletHelper";

class CreateUserWallet extends Listener {
    public handle = async (event: UserRegistered|UserSetPassword) => {
        const user = event.user;
        const password = event.password;
        const secretSeed = keystore.generateRandomSeed();

        const userWalletQuery = `SELECT "address" FROM users_wallets WHERE "userId"=${user.id}`;
        const userWallet = await sequelize.query(userWalletQuery, {
            type: QueryTypes.SELECT,
            nest: true,
            plain: true
        });
        if (userWallet === null) {
            try {
                await WalletHelper.createWallet(password, user);
            } catch (error) {
                console.log(error);
                throw new Error(error.message)
            }
        }
        
        return ;
    }
}

export default new CreateUserWallet();