import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Translation from "../../models/translation";
import Joi from "@hapi/joi";

/**
 * Class for get translation phrase validation
 */
const getAllTranslations = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: Joi.object({
            code: Joi.string().empty(['', null]).length(2, 'utf8').valid(Translation.langCodes).insensitive().default(Translation.defaultLang)
        }),
        bodySchema: null
    }

    validationProcess(req, res, next, validationRules);
}

export default getAllTranslations;