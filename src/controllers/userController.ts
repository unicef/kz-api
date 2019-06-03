import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import dateformat from "dateformat";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import i18n from "i18next";
import fs from "fs";
import ApiController from "./apiController";
import config from "../config/config";
import userIsNotActivated from "../exceptions/userIsNotActivated";
import UserAlreadyExists from "../exceptions/userAlreadyExists";
import BadActivationLink from "../exceptions/badActivationLink";
import BadEmailException from "../exceptions/badEmailException";
import ActivationHash from "../models/activationHash";
import User from "../models/user";
import Role from "../models/role";
import event from "../services/event";
import UserLoggedIn from "../events/userLoggedIn";
import UserRegistered from "../events/userRegistered";

class UserController {
    // get users list
    static getUsersList = async (req: Request, res: Response) => {
        let response = i18n.t('testlong');

        ApiController.success(req.user, res);
    }

    // get user Data about auth user
    static getMe = async (req: Request, res: Response) => {
        const user = req.user;
        let responseData: any = {
            id: user.id,
            email: user.email,
            showSeed: user.showSeed,
            showForm: false,
            createdAt: dateformat(user.createdAt, 'yy-mm-dd HH:MM:ss')
        }
        // working with rolles
        let roles: string[] = [];
        user.roles.forEach((role: Role) => {
            const roleHash: string = CryptoJS.AES.encrypt(role.id, user.id + responseData.createdAt).toString();
            roles.push(roleHash);
        });
        responseData.roles = roles;

        // get user seed phrase
        const seedPhrase = 'plot tank rate alarm dysfunctional approve garrulous saw pinch unbecoming zippy direful';
        if (user.showSeed) {
            // generate txt file with seed
            fs.writeFile(__dirname + '/../../assets/users/files/' + user.passwordSalt + ".txt", seedPhrase, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
            });

            responseData.seedPrase = {
                phrase: seedPhrase,
                link: 'http://localhost:3000/file?id=' + user.id
            }
        }
        // showForm flag
        if (!user.personalData.isFilledData()) {
            responseData.showForm = true;
        }

        return res.json(responseData);
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

            event(new UserRegistered(user));
            
            const responseData = {
                userId: user.id,
                message: i18n.t('successCreatedPartner')
            };
            return ApiController.success(responseData, res);
        } catch(error) {
            ApiController.failed(error.status, error.message, res, undefined);
            return;
        }
    }

    // activation user process
    static activationProcess = async (req: Request, res: Response) => {
        const hash = req.body.hash;
        try {

            console.log("hash");
            console.log(hash);
            // get activation hash model
            const hashModel = await ActivationHash.findOne({
                where: {hash: hash}
            }) || false;
            console.log("hashModel");
            console.log(hashModel);
            // check expires
            let today: Date = new Date();
            if (!hashModel || today > hashModel.expiredAt) {
                console.log('Bad activation hash error');
                throw new BadActivationLink(400, i18n.t('badActivationLink'), i18n.t('badActivationLink'))
            }
            // get activation user
            const user = await User.findByPk(hashModel.userId) || false;
            console.log('user');
            console.log(user);
            if (!user) {
                console.log('Bad activation hash error');
                throw new BadActivationLink(400, i18n.t('badActivationLink'), i18n.t('badActivationLink'))
            }
            // activation process
            user.emailVerifiedAt = new Date();
            user.save();

            hashModel.destroy();
            console.log('END');

            const responseData = {
                message: i18n.t('successUserActivation')
            }

            console.log(responseData);
            return ApiController.success(responseData, res);
        } catch (error) {
            ApiController.failed(error.status, error.message, res, undefined);
            return;
        }
        
    }

    static login = async (req: Request, res: Response) => {
        try {
            const user = await User.findOne({
                where: {
                    email: req.body.email
                }
            }) || false;
            if (!user) {
                console.log('Bad user email');
                throw new BadEmailException(403, i18n.t('badEmailOrPass'), i18n.t('badEmailOrPass'))
            }
            // check user password
            if (!user.checkPassword(req.body.password)) {
                console.log('Bad user password');
                throw new BadEmailException(403, i18n.t('badEmailOrPass'), i18n.t('badEmailOrPass'))
            }
    
            // check user activation 
            if (user.emailVerifiedAt == null) {
                console.log('User don\'t activate');
                throw new userIsNotActivated(412, i18n.t('userIsNotActivated'), i18n.t('userIsNotActivated'))
            }
    
            let token = jwt.sign({userEmail: user.email},
                config.jwt.secret,
                { expiresIn: '24h'});
            
            event(new UserLoggedIn(user));

            const responseData = {
                token: token,
                message: i18n.t('userSuccessfulAuth')
            };
            
            ApiController.success(responseData, res);
        } catch (error) {
            ApiController.failed(error.status, error.message, res, 142);
            return;
        }
        
    }

    static changeShowSeedFlag = async (req: Request, res: Response) => {
        if (req.user.showSeed) {
            req.user.showSeed = false;
            req.user.save();
        }

        const responseData = {
            message: i18n.t('successChangeShowFeedFlag')
        }

        return ApiController.success(responseData, res);
    }

    static setUserPersonalData = async (req: Request, res: Response) => {
        for (var key in req.user.personalData.dataValues) {
            if (req.body[key]) {
                req.user.personalData[key] = req.body[key];
            }
        }
        req.user.personalData.save();
        
        return ApiController.success({}, res);
    }
}
export default UserController;