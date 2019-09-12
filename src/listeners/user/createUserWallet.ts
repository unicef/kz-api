import { keystore } from "eth-lightwallet";
import sequelize from "../../services/sequelize";
import { QueryTypes } from "sequelize";
import CryptoJS from "crypto-js";
import Listener from "../listener";
import UserRegistered from "../../events/userRegistered";
import UserSetPassword from "../../events/userSetPassword";



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
            keystore.createVault({
                password: password,
                seedPhrase: secretSeed,
                hdPathString: "m/44'/60'/0'/0"
            }, function (err, ks) {
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    const ts = user.createdAt.getMilliseconds().toString();
                    if (err) throw err;
                    ks.generateNewAddress(pwDerivedKey, 1);
                    const walletKey = ks.getAddresses();
                    let ksSerialize = ks.serialize();
                    // write user wallet row
                    const query = `INSERT INTO users_wallets ("userId", "address", "ks", "pw") VALUES (${user.id}, '${walletKey[0]}', '${CryptoJS.AES.encrypt(ksSerialize, ts).toString()}', '${CryptoJS.AES.encrypt(pwDerivedKey.toString(), ts).toString()}')`;
    
                    sequelize.query(query, {type: QueryTypes.INSERT});
                });
            });
        }
        
        return ;
    }
}

export default new CreateUserWallet();