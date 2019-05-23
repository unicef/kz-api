import { Request, Response, NextFunction } from "express";
import i18next from "i18next";
import config from "../config/config";

const localizationService = (req: Request, res: Response, next: NextFunction) => {
    const lang = req.header('Lang') || 'en';
    i18next.changeLanguage(lang);

    next();
}

export default localizationService;



