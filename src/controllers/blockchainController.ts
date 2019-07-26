import { Request, Response } from "express";
import { keystore } from "eth-lightwallet";
import ApiController from "./apiController";
import config from "../config/config";
import i18n from "i18next";
import Web3 from 'web3';
import {Eth} from 'web3-eth';

class BlockchainController {
    /**
     * Get available locales
     * 
     * @param req 
     * @param res 
     */
    static testBlockchain = async (req: Request, res: Response) => {
        //address: '0x885EDf432C58B5296582E02111B0Af9DC7F76D8f',
        //privateKey: '0x7d71773dd35dcdbe4929030c1fc9ea6c742476b318cb345fce32426bea27e65a'
        // the seed is stored encrypted by a user-defined password
        const password = 'cukerman1092';
        const secretSeed = keystore.generateRandomSeed();
        let walletKey = null;
        keystore.createVault({
            password: password,
            seedPhrase: secretSeed,
            hdPathString: "m/44'/60'/0'/0"
        }, function (err, ks) {
            let ksSerialize = ks.serialize();
            // Some methods will require providing the `pwDerivedKey`,
            // Allowing you to only decrypt private keys on an as-needed basis.
            // You can generate that value with this convenient method:
            ks.keyFromPassword(password, function (err, pwDerivedKey) {
                if (err) throw err;

                // generate five new address/private key pairs
                // the corresponding private keys are also encrypted
                ks.generateNewAddress(pwDerivedKey, 1);
                walletKey = ks.getAddresses();
                // Now set ks as transaction_signer in the hooked web3 provider
                // and you can start using web3 using the keys/addresses in ks!
                return res.json({
                    success: true,
                    seedPhrase: secretSeed,
                    walletKey: walletKey.toString(),
                    ks: ksSerialize
                });
            });
        });
    };
    
}
export default BlockchainController;