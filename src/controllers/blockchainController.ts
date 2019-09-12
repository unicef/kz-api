import { Request, Response } from "express";
import { keystore } from "eth-lightwallet";
import CryptoJS from "crypto-js";
import ApiController from "./apiController";
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
        const ts = '490';

        const ks = keystore.deserialize(CryptoJS.AES.decrypt("U2FsdGVkX1/PrcqAZ6XyBb/86/kwmg1/8ODwZRzGm3LWodnKnyNYr/zZ0NP8YSd/eUAQX/ipKGAzBGhOjfOY5Dsp2bukOcdsG1Et0MhiAnV8xL67XsoiYw8GSqu+/aYnhfYKO2Y7bNKUrZD8vthsdqNUnRRMz+xM/2QcW02pvkmfIJJPsHVn3Ec6tssNOqrpoKYzC1f1D6/bDoHkZ7jP2AK4kW+ubsBDkFwjd5o2qiBSD8ksfSOketP0yVmNrDo5WDFVMJMJTowgLUyBWn/3I04BhlFQ7PlAUPhIzDkw1UpX/aeyGqcXDl0mow4FZBml6ammwvBckumEwLG1elNa9/0XnOD4U0pj1shhgPRNv0KraTwnYlvfrmfLUNYWGF93ZqsQYQiy7Jfyxt1hBtMcIp2fEvmuYTprg3lWuebEz0yhkwdwdiXtmhcaCKwtO4qRvij4Lj0rZKPy/W0VnxB9Dx/sYRV2d0nLVmbcvAGMW/qhQycBN8FldRrfVL9D2wt/K59EJlWV1svt5h1HUh40EFCgAKBQYtFc1emFIXzeVwrxwJfErPOnXd58gZqOi94W5PON0O6/zxTfTvt/UAkPn6xKJBeBfPuloL4/dsglraQ8USEaKv+9N72cfJmIuC7qwlov8ZbOlzADAS/XAhYTI45AU0TSPNDsoPyT2rlqNP49HCkRStRrLQd4ct628NTmPlQV4XSfqxyxpNYEhGURCjQHOejgNQAvIFHgMKNpa7bPb+fuuXwnXIMzZU7Ah7rjhlA511a3iPGBqUeRFxS4Hezq7KzHSH59psnNd5SoxiApX7srkBT72RAMSN+PhKszaYcH9S0y0CqCgEMrV0Tcmn2Ka1dalB0iBipKGZBM48d12MA6uN7jEGKmGBhIgTsIeOXgPrsRQSAN5qrxGtLdeF6JnHBKavtUj6IE2Z02FtWViZK9VYz/lrZ/qYvQkUNHPMNAqDxlTCM08RHhlgePfWJQC8jT7jh3fhlURq40C8c/rM7oFXjnOCc3oh5B2q1LO/un9RsLtOPNSpoa37E8kGtKO2vopawSIQ0ihpTNQd+8o3mVhvfg8GuvK1Y789vxYrEvVW2dkNR1PXrBx2imfN330J3efKH40FJpcBWp7DCLXwzm5sO+vQJQcNjPtPVb", ts).toString(CryptoJS.enc.Utf8));

        const pwdString = CryptoJS.AES.decrypt("U2FsdGVkX1+5pEhXQmffpN2uVOltYjZ4AYaR/FMzy1Jb/whthvOuaBK8pzoBstVirs5OgTap7p11plRga0RB334p1ebcTxROVDOJ7tHODNW1NA/laIKZEZEkhDLvUeV07TTrbQ2OlZC+fbAHbSwK3MBGZjiitRhG0GlDYLw7ntQ=", ts).toString(CryptoJS.enc.Utf8);
        const pwdArr = pwdString.split(',');

        const privateKey = ks.exportPrivateKey("0x1e210df600c1e7782bd69c25530ea19b9f800f61", Uint8Array.from(pwdArr));
    
        return res.json({
                        success: true,
                        ks: ks,
                        pk: privateKey,
                    });

        // keystore.createVault({
        //     password: password,
        //     seedPhrase: secretSeed,
        //     hdPathString: "m/44'/60'/0'/0"
        // }, function (err, ks) {
        //     // Some methods will require providing the `pwDerivedKey`,
        //     // Allowing you to only decrypt private keys on an as-needed basis.
        //     // You can generate that value with this convenient method:
        //     ks.keyFromPassword(password, function (err, pwDerivedKey) {
        //         const ts = new Date().getMilliseconds().toString();
        //         if (err) throw err;

        //         // generate five new address/private key pairs
        //         // the corresponding private keys are also encrypted
        //         ks.generateNewAddress(pwDerivedKey, 1);
        //         walletKey = ks.getAddresses();
        //         let ksSerialize = ks.serialize();

        //         let pK = ks.exportPrivateKey(walletKey[0], pwDerivedKey);
        //         // Now set ks as transaction_signer in the hooked web3 provider
        //         // and you can start using web3 using the keys/addresses in ks!
        //         return res.json({
        //             success: true,
        //             seedPhrase: secretSeed,
        //             walletKey: walletKey[0],
        //             ts: ts,
        //             ksSerialize: CryptoJS.AES.encrypt(ksSerialize, ts).toString(),
        //             pwDerivedKey: CryptoJS.AES.encrypt(pwDerivedKey.toString(), ts).toString()
        //         });
        //     });
        // });
    };
    
}
export default BlockchainController;