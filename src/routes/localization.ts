import { Router } from "express";
import LocalizationController from "../controllers/localizationController";
import getPhraseValidate from "../requests/localization/getPhraseRequest";
import getAllTranslations from "../requests/localization/getAllTranslation";
import postNewTranslation from "../requests/localization/postNewTranslation";
//import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// get available locales
router.get("/locales", LocalizationController.getAvailableLocales);

// get single phrase by key
router.get("/phrase", getPhraseValidate, LocalizationController.getTranslation);

// get all phrases by language code
router.get("/", getAllTranslations, LocalizationController.getAllTranslations);

// set new or update exists phrase
router.post("/phrase", postNewTranslation, LocalizationController.getAllTranslations);



export default router;