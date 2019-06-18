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
                    const tmpFile = await TmpFile.findByPk(element.docId);
                    if (tmpFile) {
                        const partnerDocument = await PartnerDocument.create({
                            partnerId: partner.id,
                            userId: tmpFile.userId,
                            title: element.title,
                            filename: tmpFile.getFullFilename(),
                            size: tmpFile.size
                        });
                        const documentsFolder = '../../../assets/partners/documents/';
                        const fileFoler = tmpFile.id.substring(0, 2);
                        tmpFile.copyTo(documentsFolder+fileFoler, tmpFile.getFullFilename());
                        tmpFile.deleteFile();
                    } else {
                        console.log('File wasn\'t uploaded');
                        throw new Error('Fuck You');
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
}

export default AdminPartnerController;