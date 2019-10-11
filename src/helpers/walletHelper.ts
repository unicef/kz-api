
import { keystore } from "eth-lightwallet";
import CryptoJS from "crypto-js";
import axios from "axios";
import User from "../models/user";
import sequelize from "../services/sequelize";
import { QueryTypes } from "sequelize";
import UserRepository from "../repositories/userRepository";
import event from "../services/event";
import UserWalletCreated from "../events/userWalletCreated";

class WalletHelper {

    static getWallPhrase = async (userWallet: iWallet, user: User) => {
        if (userWallet && user) {
            const ts = user.createdAt.getMilliseconds().toString();
            const ks = keystore.deserialize(CryptoJS.AES.decrypt(userWallet.ks, ts).toString(CryptoJS.enc.Utf8));

            const pwdString = CryptoJS.AES.decrypt(userWallet.pw, ts).toString(CryptoJS.enc.Utf8);
            const pwdArr = pwdString.split(',');
            const pwd = Uint8Array.from(pwdArr);

            const seed = ks.getSeed(pwd);
            return seed;
        }
        return '';
    }

    static getWallPrivate = async (userWallet: iWallet, user: User) => {
        if (userWallet && user) {
            const ts = user.createdAt.getMilliseconds().toString();
            const ks = keystore.deserialize(CryptoJS.AES.decrypt(userWallet.ks, ts).toString(CryptoJS.enc.Utf8));

            const pwdString = CryptoJS.AES.decrypt(userWallet.pw, ts).toString(CryptoJS.enc.Utf8);
            const pwdArr = pwdString.split(',');
            const pwd = Uint8Array.from(pwdArr);

            const prvtKey = ks.exportPrivateKey(userWallet.address, pwd);
            return prvtKey;
        }
        return '';
    }

    static createWallet = async (password: string, user: User) => {
        const secretSeed = keystore.generateRandomSeed();

        const wallet = keystore.createVault({
            password: password,
            seedPhrase: secretSeed,
            hdPathString: "m/44'/60'/0'/0"
        }, function (err, ks) {
            if (err) {
                throw new Error(err.message);
            }
            ks.keyFromPassword(password, function (err, pwDerivedKey) {
                if (err) throw err;
                const ts = user.createdAt.getMilliseconds().toString();
                ks.generateNewAddress(pwDerivedKey, 1);
                const walletKey = ks.getAddresses();
                let ksSerialize = ks.serialize();
                // write user wallet row
                const query = `INSERT INTO users_wallets ("userId", "address", "ks", "pw") VALUES (${user.id}, '${walletKey[0]}', '${CryptoJS.AES.encrypt(ksSerialize, ts).toString()}', '${CryptoJS.AES.encrypt(pwDerivedKey.toString(), ts).toString()}')`;

                sequelize.query(query, {type: QueryTypes.INSERT}).then((data) => {
                    event(new UserWalletCreated(user));
                });
            });
        });

        return wallet;
    }

    static chargeTestGas = async (walletAddress: string) => {
        // make request to faucet.metamask.io for generating test eth for ropsten network
        const faucetUrl = 'https://faucet.metamask.io/';
        const request = axios.post(
            faucetUrl, 
            walletAddress,
            {
                headers: {
                    'Content-Type' : 'application/rawdata'
                }
            }
        ).then((response) => {
            console.log(`ADD TEST GAS TO ${walletAddress} TRANSACTION DATA: ${response.data}`);
        })

        return true;
    }
}

export default WalletHelper;