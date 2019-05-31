import { Router } from "express";
import UserController from "../controllers/userController";
import postNewPartner from "../requests/user/postNewPartner";
import { checkRecaptcha } from "../middlewares/checkRecaptcha";
import postActivationProcess from "../requests/user/postActivationProcess";
import postLogin from "../requests/user/postLogin";
import checkAuthToken from "../middlewares/checkAuthToken";
import putUserInformation from "../requests/user/putUserInformation";

const router = Router();


// get all users
router.get("/", [checkAuthToken], UserController.getUsersList);
router.post("/partner", [postNewPartner, checkRecaptcha], UserController.createPartner);
router.post("/activation", [postActivationProcess], UserController.activationProcess);
router.post("/login", [postLogin, checkRecaptcha], UserController.login);
router.patch("/seed", [checkAuthToken], UserController.changeShowSeedFlag);
router.put("/information", [checkAuthToken, putUserInformation], UserController.setUserPersonalData)

export default router;