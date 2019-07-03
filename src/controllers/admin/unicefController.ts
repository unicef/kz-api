import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import Role from "../../models/role";
import ApiController from "../apiController";
import User from "../../models/user";
import UserAlreadyExists from "../../exceptions/userAlreadyExists";
import UnicefHelper from "../../helpers/unicefHelper";
import UserPersonalData from "../../models/userPersonalData";
import HttpException from "../../exceptions/httpException";

class AdminUnicefController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        const roles = await Role.getUnicefRoles();

        const responseData = {
            roles: roles
        }

        return ApiController.success(responseData, res);
    }

    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // check user exists
            const userExists = await User.isUserExists(req.body.user.email);
            if (userExists) {
                throw new UserAlreadyExists();
            }

            // creating user
            const user = await User.generateUser(req.body.user.email);
            // add role to user
            const role = await Role.findByPk(req.body.user.role.id);
            user.addRole(role);

            // working with user data
            let userData: any = UnicefHelper.getUnicefDataFromRequest(req.body.user);
            userData['userId'] = user.id;
            const userPersonalData = await UserPersonalData.create(userData);

            return ApiController.success({
                message: i18n.t('successUnicefCreation'),
                userId: user.id
            }, res);
        } catch (error) {
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

export default AdminUnicefController;