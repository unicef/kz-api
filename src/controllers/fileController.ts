import { Request, Response } from "express";
import ApiController from "./apiController";
import fs from "fs";
import User from "../models/user";

class FileController{
    // get users list
    static getFile = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.query.id);
            const file = __dirname + '/../../assets/users/files/' + user.passwordSalt + ".txt";
            res.download(file, 'seed.txt');
        } catch (error) {
            ApiController.failed(503, error.message, res);
            return;
        }
    }
}
export default FileController;