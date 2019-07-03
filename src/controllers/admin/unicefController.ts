import { Request, Response, NextFunction } from "express";
import Sequelize from "sequelize";
import Role from "../../models/role";
import ApiController from "../apiController";

class AdminUnicefController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        const roles = Role.getUnicefRoles();

        const responseData = {
            roles: roles
        }

        return ApiController.success(responseData, res);

        // TODO - add in ApiDoc
    }
}

export default AdminUnicefController;