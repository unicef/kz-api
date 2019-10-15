import Web3 from "web3";
import Config from "../services/config";
import MultisignatureContract from "../services/multisignatureContract";
import FaceRequestChain from "../models/faceRequestChain";
import WalletHelper from "./walletHelper";
import { Transaction } from "ethereumjs-tx";
import UserRepository from "../repositories/userRepository";
import BlockchainController from "../controllers/blockchainController";
import PartnerRepository from "../repositories/partnerRepository";
import PartnerHelper from "./partnerHelper";
import FaceRequestContractRepository from "../repositories/faceRequestContractRepository";
import User from "../models/user";
import FaceRequestRepository from "../repositories/faceRequestRepository";
import ActivityRepository from "../repositories/activityRepository";
import FaceRequest from "../models/faceRequest";
import ProjectTransaction from "../models/projectTransaction";
import ProjectRepository from "../repositories/projectRepository";
import event from "../services/event";
import GotTransactionHash from "../events/gotTransactionHash";
import UserHasNoBalance from "../exceptions/user/userHasNoBalance";
import i18next from "i18next";

class BlockchainHelper {
    static getTransactionReceipt = async (transactionHash: string) => {
        try {
            const web3: Web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
            const receipt = await web3.eth.getTransactionReceipt(transactionHash);
            return receipt;
        } catch (error) {
            console.log(error);
        }
    }

    static sendSubmitTransaction = async (contractAddress: string, requestId: number) => {
        const web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
        let contract = new web3.eth.Contract(MultisignatureContract.ABI, contractAddress);
        // get user which validated request
        const faceRequestChain = await FaceRequestChain.findOne({
            where: {
                requestId: requestId
            },
            attributes: ['validateBy']
        });
        if (faceRequestChain) {
            const user = await User.findOne({
                where: {
                    id: faceRequestChain.validateBy
                }
            });
            const userWallet = await UserRepository.findWalletById(faceRequestChain.validateBy);
            if (user && userWallet) {
                const dataString = web3.utils.toHex("This is test data)");
                // get receiver wallet
                const partnerId = await PartnerRepository.getIdByRequestId(requestId);
                const authorised = await PartnerHelper.getPartnerAuthorised(partnerId);
                if (authorised==null) {
                    throw new Error('Authorised not found');
                }
                const authWallet = await UserRepository.findWalletById(authorised.id);
                let privateKey = await WalletHelper.getWallPrivate(userWallet, user);
                // get total amount F
                const requestAmount = await ActivityRepository.getTotalRequestAmounts(requestId);
                if (requestAmount && requestAmount.totalF) {
                    const transactionAmount = requestAmount.totalF*100;
                    let data = contract.methods.submitTransaction(authWallet.address, transactionAmount, dataString).encodeABI();
                    const serializedTx = await BlockchainHelper.serializeTx(web3, contract, userWallet.address, privateKey, data);
    
                    let result = await web3.eth.sendSignedTransaction(serializedTx).on('transactionHash', function (hash) {
                        FaceRequestContractRepository.setContractProperty(requestId, 'validateHash', hash);
                    });
                    return result;
                } else {
                    throw new Error(`Can't get request amountF for transaction`);
                }
                
            }
        }
    }

    static rejectContract = async (contractAddress: string, user: User) => {
        // get user wallet for rejecting
        const userWallet = await UserRepository.findWalletById(user.id);
        const web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
        let contract = new web3.eth.Contract(MultisignatureContract.ABI, contractAddress);
        // method cancelfirmation from owner wallet address
        if (userWallet) {
            let privateKey = await WalletHelper.getWallPrivate(userWallet, user);
                let data = contract.methods.cancelfirmation().encodeABI();
                const serializedTx = await BlockchainHelper.serializeTx(web3, contract, userWallet.address, privateKey, data);
                let result = web3.eth.sendSignedTransaction(serializedTx);
                return result;
        } else {
            throw new Error(`User ${user.id} doesn't have wallet for rejecting cotract process`);
        }
    }

    static confirmContract = async (contractAddress: string, faceRequestId: number, faceRequestStatus: string, user: User, nextUserWallet: string) => {
        const userWallet = await UserRepository.findWalletById(user.id);
        const web3 = new Web3(Config.get("INFURA_PROJECT_URL", 'https://ropsten.infura.io/v3/015647b81e8d46c3a0e68bc0279641c7'));
        let contract = new web3.eth.Contract(MultisignatureContract.ABI, contractAddress);
        if (userWallet) {
            let privateKey = await WalletHelper.getWallPrivate(userWallet, user);
                let data = contract.methods.confirmTransaction(0, nextUserWallet.address).encodeABI();
                const serializedTx = await BlockchainHelper.serializeTx(web3, contract, userWallet.address, privateKey, data);
                let result = web3.eth.sendSignedTransaction(serializedTx).on('transactionHash', function (hash) {
                    FaceRequestContractRepository.setContractProperty(faceRequestId, `${faceRequestStatus}Hash`, hash);
                    event(new GotTransactionHash(faceRequestId, hash, faceRequestStatus));
                });
                return result;
        } else {
            throw new Error(`User ${user.id} doesn't have wallet for confirm cotract process`);
        }
    }

    static serializeTx = async (web3: Web3, contractInstance, publicKey, privateKey, funcData) => {
        let privateKeyBuff = new Buffer(privateKey, 'hex');
        const gasLimit = Config.get("GAS_LIMIT", 50000);
        // check if user wallet has enough wei for make transaction
        const balance = await web3.eth.getBalance(publicKey);
        if (gasLimit > parseInt(balance)) {
            throw new UserHasNoBalance(400, 364, i18next.t('userWalletAddressHasNoBalance', { address: publicKey }));
        }
        const nonceNumber = await web3.eth.getTransactionCount(publicKey);
        const nonce = web3.utils.toHex(nonceNumber);
        const gasPrice = web3.utils.toHex(await web3.eth.getGasPrice() * 2);
        const gasLimitHex = web3.utils.toHex(gasLimit);
        const rawTx = {
            'nonce': nonce,
            'gasPrice': gasPrice,
            'gasLimit': gasLimitHex,
            'from': publicKey,
            'to': contractInstance._address,
            'data': funcData
        };

        let tx = new Transaction(rawTx, { chain: Config.get("BC_NETWORK", 'ropsten') });
        tx.sign(privateKeyBuff);

        return '0x' + tx.serialize().toString('hex');
    };
}

export default BlockchainHelper;