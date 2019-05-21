import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";

/**
 * Class for get translation phrase validation
 */
const getPhraseValidate = (req: Request, res: Response, next: NextFunction) => {
    const validationRules = {
        querySchema: Joi.object({key: Joi.string().min(3).required()}),
        bodySchema: null
    }

    validationProcess(req, res, next, validationRules);
}

export default getPhraseValidate;