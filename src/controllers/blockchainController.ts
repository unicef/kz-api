import { Request, Response } from "express";
import ApiController from "./apiController";
import Config from "../services/config";
import DigicusContract from "../services/digicus";

class BlockchainController {
    static deployDigicus = async (req: Request, res: Response) => {
      try {
        const secret = Config.get("DEPLOY_SECRET", "deploySecret");
        if (req.body.secret != secret) {
          throw new Error('Bad secret');
        }

        const digicusContract = await DigicusContract.deployContract();

        if (digicusContract) {
          digicusContract.then((error, receipt) => {
            if (error) {
              console.log("ERROR", error);
              return ApiController.failed(400, 'ERROR BLOCKCHAIN', res);
            }
            console.log("RECEIPT: ", receipt);
            return ApiController.success(receipt, res);
          });
        }        
      } catch (error) {
        return ApiController.failed(400, error.message,res);
      }
    }
    
}
export default BlockchainController;