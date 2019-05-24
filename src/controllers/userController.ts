import { Request, Response } from "express";
import i18n from "i18next";
import cryptoRandomString from "crypto-random-string";
import ApiController from "./apiController";
import ActivationLinkMail from "../mails/activationLinkMail";
import User from "../models/user";
import Role from "../models/role";
import UserAlreadyExists from "../exceptions/userAlreadyExists";



class UserController {
    // get users list
    static getUsersList = async (req: Request, res: Response) => {
        let response = i18n.t('testlong');

        ApiController.success(response, res);
    }

    // create partner process
    static createPartner = async (req: Request, res: Response) => {
        try {
            // check exists user
            let user: any = await User.findOne({
                where: {email: req.body.email},
            });
            if (user !== null) {
                throw new UserAlreadyExists(400, i18n.t('userExistsError'), i18n.t('userExistsError'));
            }

            // creating user
            const passwordSalt: string = cryptoRandomString(10);
            user = await User.create({
                email: req.body.email,
                password: User.generatePassword(passwordSalt, req.body.password),
                passwordSalt: passwordSalt
            })


            // add Responsible assistant role to user
            const role = await Role.findByPk('ra');
            user.addRole(role);

            // activation mail sending
            let mail = new ActivationLinkMail(user);
            mail.send();
            
            const responseData = {
                usedId: user.id,
                message: i18n.t('successCreatedPartner')
            };
            return ApiController.success(responseData, res);
        } catch(error) {
            ApiController.failed(error.status, error.message, undefined, res);
            return;
        }
    }
}
export default UserController;