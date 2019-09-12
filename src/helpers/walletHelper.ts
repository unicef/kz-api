
import { keystore } from "eth-lightwallet";
import CryptoJS from "crypto-js";
import User from "../models/user";
import UserRepository from "../repositories/userRepository";

class WalletHelper {
    static getWallPhrase = async (user: User) => {
        const userWallet: iWallet|null = await UserRepository.findWalletById(user.id);

        if (userWallet) {
            const ts = user.createdAt.getMilliseconds().toString();
            const ks = keystore.deserialize(CryptoJS.AES.decrypt(userWallet.ks, ts).toString(CryptoJS.enc.Utf8));

            const pwdString = CryptoJS.AES.decrypt(userWallet.pw, ts).toString(CryptoJS.enc.Utf8);
            const pwdArr = pwdString.split(',');
            const pwd = Uint8Array.from(pwdArr);

            const seed = ks.getSeed(pwd);
            return seed
        }
        return '';
    }
}

interface iWallet {
    userId: number;
    address: string;
    ks: string;
    pw: string;
}

export default WalletHelper;