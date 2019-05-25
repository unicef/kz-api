import { Request, Response } from "express";
import i18n from "i18next";
import cryptoRandomString from "crypto-random-string";
import ApiController from "./apiController";
import ActivationLinkMail from "../mails/activationLinkMail";
import User from "../models/user";
import Role from "../models/role";
import UserAlreadyExists from "../exceptions/userAlreadyExists";
import ActivationHash from "../models/activationHash";
import BadActivationLink from "../exceptions/badActivationLink";



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

    // activation user process
    static activationProcess = async (req: Request, res: Response) => {
        const hash = req.body.hash;
        try {
            // get activation hash model
            const hashModel = await ActivationHash.findOne({
                where: {hash: hash}
            }) || false;
            // check expires
            let today: Date = new Date();
            if (!hashModel || today > hashModel.expiredAt) {
                console.log('Bad activation hash error');
                throw new BadActivationLink(400, i18n.t('badActivationLink'), i18n.t('badActivationLink'))
            }
            // get activation user
            const user = await User.findByPk(hashModel.userId) || false;
            if (!user) {
                console.log('Bad activation hash error');
                throw new BadActivationLink(400, i18n.t('badActivationLink'), i18n.t('badActivationLink'))
            }
            // activation process
            user.emailVerifiedAt = new Date();
            user.save();

            hashModel.destroy();

            const responseData = {
                message: i18n.t('successUserActivation')
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            ApiController.failed(error.status, error.message, undefined, res);
            return;
        }
        
    }
}
export default UserController;