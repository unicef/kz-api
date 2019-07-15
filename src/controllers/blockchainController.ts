import { Request, Response } from "express";
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
        console.log('GOOD'); 
        return res.json({success: true});
    };
    
}
export default BlockchainController;