import { Request, Response, NextFunction } from "express";
import { validationProcess } from "../../middlewares/validate";
import Joi from "@hapi/joi";

const postNewPartner = (req: Request, res: Response, next: NextFunction) => {
    let validationRules: any = {
        bodySchema: Joi.object({
            email: Joi.string().email({ minDomainSegments: 2 }),
            password: Joi.string().min(10).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*~^()_+`\-={}\[\]:;<>\\\/?])[A-Za-z\d#$@!%&*~^()_+`\-={}\[\]:;<>.\\\/?]{10,}$/),
            password_confirmation: Joi.string().required().valid(Joi.ref('password')),
            "g-recaptcha-response": Joi.string().required()
        }),
        querySchema: null
    };

    validationProcess(req, res, next, validationRules);
}

export default postNewPartner;