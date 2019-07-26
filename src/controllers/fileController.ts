import { Request, Response } from "express";
import ApiController from "./apiController";
import mime from "mime-types";
import fs from "fs";
import User from "../models/user";

class FileController{
    // get users list
    static getFile = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.query.id);
            if (user) {
                const filePath = __dirname + '/../../assets/users/files/' + user.passwordSalt + ".txt";
                const fileBuffer = fs.readFileSync(filePath);

                const base64 = Buffer.from(fileBuffer).toString('base64');
                const contentType = mime.contentType('.txt');
                if (contentType) {
                    const responseData = {
                            filename : 'seedPhrase.txt',
                            contentType: contentType,
                            doc: base64
                        };
                    ApiController.success(responseData, res);
                    return ;
                } else {
                    ApiController.failed(500, 'document wasn\'t found', res);
                    return ;
                }
            }
            res.status(404);
            return;
        } catch (error) {
            ApiController.failed(503, error.message, res);
            return;
        }
    }
}
export default FileController;