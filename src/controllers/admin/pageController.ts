import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import Page from "../../models/page";

class AdminPageController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        let pageData = req.body;
        const page = await Page.create(pageData);

        
    }
}

export default AdminPageController;