import { Request, Response } from "express";
import ApiController from "./apiController";
import config from "../config/config";
import User from "../models/user";
import i18n from "i18next";


class UserController {
    // get users list
    static getUsersList = async (req: Request, res: Response) => {
        let response = i18n.t('testlong');

        ApiController.success(response, res);
    }

    static createPartner = async (req: Request, res: Response) => {
        let user: any = await User.findOne({
            where: {email: req.body.email},
        });
        if (user !== null) {
            res.json({
                success:false
            });
            return;
        }
        user = await User.create({
            email: req.body.email,
            password: req.body.password,
        })
        
        res.json(user);
    }
}
export default UserController;