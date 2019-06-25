import { Request, Response } from "express";
import cryptoRandomString from "crypto-random-string";
import Sequelize from "sequelize";
import fs from "fs";
import i18n from "i18next";
import User from "../../models/user";
import UserHelper from "../../helpers/userHelper";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import Role from "../../models/role";
import UserPersonalData from "../../models/userPersonalData";
import event from "../../services/event";
import UserRegisteredRemotely from "../../events/userRegisteredRemotely";
import PartnerHelper from "../../helpers/partnerHelper";
import Partner from "../../models/partner";
import ApiController from "../apiController";
import HttpException from "../../exceptions/httpException";
import TmpFile from "../../models/tmpFile";
import PartnerDocument from "../../models/partnerDocument";
import UserNotfind from "../../exceptions/userNotFind";
import PartnerNotFind from "../../exceptions/partnerNotFind";
import DocumentHelper from "../../helpers/documentHelper";

class AdminPartnerController {
    static createPartner = async (req: Request, res: Response) => {
        try {
            // check user exists
            const userExists = await User.isUserExists(req.body.user.email);
            if (userExists) {
                throw new UserAlreadyExists();
            }

            // creating user
            const passwordSalt: string = cryptoRandomString(10);
            const password: string = cryptoRandomString(12);

            const user = await User.generateUser(req.body.user.email);
            // add role to user
            const role = await Role.findByPk(req.body.user.role.id);
            user.addRole(role);

            // working with user data
            let userData: any = UserHelper.getUserDataFromRequest(req.body.user);
            userData['userId'] = user.id;
            const userPersonalData = await UserPersonalData.create(userData);

            let partner: any = null;
            if (req.body.user.role.id == 'ra') {
                let partnerData: any = PartnerHelper.getPartnerDataFromRequest(req.body.company);
                // create new partner
                partnerData["assistId"] = user.id;

                partner = await Partner.create(partnerData);
            } else {
                partner = await Partner.findOne({
                    where: {
                        id: req.body.user.company.id
                    }
                });
                if (partner) {
                    partner.authorisedId = user.id;
                    partner.save();
                }
            }
            // working with documents 
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    const tmpFile = await TmpFile.findByPk(element.id);
                    if (tmpFile) {
                        const partnerDocument = await PartnerDocument.create({
                            partnerId: partner.id,
                            userId: tmpFile.userId,
                            title: element.title,
                            filename: tmpFile.getFullFilename(),
                            size: tmpFile.size
                        });
                        const documentsFolder = __dirname + '/../../assets/partners/documents/';
                        const fileFoler = tmpFile.id.substring(0, 2);
                        tmpFile.copyTo(documentsFolder+fileFoler, tmpFile.getFullFilename());
                        tmpFile.deleteFile();
                    } else {
                        throw new Error('File wasn\'t uploaded');
                    }
                });
            }

            ApiController.success({
                message: i18n.t('successPartnerCreation'),
                userId: user.id,
                companyId: partner.id
            }, res);
            return ;
        } catch(error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static updatePartner = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.body.user.id);
            if (user == null) {
                throw new UserNotfind(400, 116, i18n.t('adminUserNotFind'), 'User with id:' + req.body.user.id + ' not find');
            }

            const partner = await Partner.findByPk(req.body.company.id);
            if (partner == null) {
                throw new PartnerNotFind(400, 110, i18n.t('adminPartnerNotFind'), 'Partner with id:' + req.body.company.id + ' nod find');
            }

            // get user request data
            let userData = UserHelper.getUserDataFromRequest(req.body.user);
            const userPersonalData = await UserPersonalData.findOne({
                where: {
                    userId: user.id
                }
            });
            if (userPersonalData == null) {
                throw new UserNotfind(400, 116, i18n.t('userPersonalDataNotFind'), 'User personal data not find');
            }
            await userPersonalData.update(userData);
            // get partner data from request
            let partnerData = PartnerHelper.getPartnerDataFromRequest(req.body.company);
            await partner.update(partnerData);
            // working with partner documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    DocumentHelper.transferDocumentFromTemp(element.id, element.title, partner);
                });
            }

            return ApiController.success({
                message: i18n.t('adminSuccessPartnerSaving')
            }, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }
}

export default AdminPartnerController;