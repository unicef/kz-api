import { Request, Response } from "express";
import ApiController from "./apiController";
import config from "../config/config";
import Translation from '../models/translation';

class LocalizationController {
    /**
     * Get available locales
     * 
     * @param req 
     * @param res 
     */
    static getAvailableLocales = async (req: Request, res: Response) => {
        ApiController.success(config.locales, res);
    };
    
    /**
     * Get translation phrases on all languages by phrase key
     * @param req 
     * @param res
     */
    static getTranslation = async (req: Request, res: Response) => {
        const translation: any = await Translation.findByPk(req.query.key);

        ApiController.success(translation, res);
    };

    /**
     * Get all phrases by language code
     * @param req 
     * @param res 
     */
    static getAllTranslations = async (req: Request, res: Response) => {
        if (req.query.code == '' || typeof req.query.code == 'undefined') {
            req.query.code = Translation.defaultLang;
        }

        const returnTranslations: any = {};
        await Translation.findAll({
            attributes: ["key", req.query.code]
        }).then(translations=> {
            translations.forEach(function(translation: any) {
                returnTranslations[translation.key] = translation[req.query.code];
            })
        });

        ApiController.success(returnTranslations, res);
    };

    /**
     * Create new or update exists translation
     * @param req 
     * @param res 
     */
    static saveTranslation = async (req: Request, res: Response) => {
        let translation: Translation = new Translation;
        let createdNew: boolean = false;
        const key: string = req.body.key;
        const defaults: {[key: string] : string} = {};
        const locales = config.locales;

        // set defaults translation values
        for (let key in locales) {
            defaults[key] = req.body[key]
        }

        // find or create new translation
        await Translation.findOrCreate({
            where: {key: key},
            defaults: defaults
        }).then(([dbTranslation, created]) => {
            translation = dbTranslation;
            createdNew = created;
        });

        if (!createdNew && translation instanceof Translation) {
            // update exists translation
            for (let key in defaults) {
                (<any>translation)[key] = req.body[key];
            }
            translation.save();
        }

        res.json({success:true, translation: translation});
    }
}
export default LocalizationController;