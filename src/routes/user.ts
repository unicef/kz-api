import { Router } from "express";
import UserController from "../controllers/userController";
import postNewPartner from "../requests/user/postNewPartner";
import { checkRecaptcha } from "../middlewares/checkRecaptcha";
import postActivationProcess from "../requests/user/postActivationProcess";
import postLogin from "../requests/user/postLogin";
import checkAuthToken from "../middlewares/checkAuthToken";
import putUserInformation from "../requests/user/putUserInformation";
import putUserPasswordManual from "../requests/user/putUserPasswordManual";
import getUserById from "../requests/user/getUserById";
import postForgotPassword from "../requests/user/postForgotPassword";
import repeatActivationLink from "../requests/user/repeatActivationLink";

const router = Router();

// get all users
router.post("/partner", [postNewPartner, checkRecaptcha], UserController.createPartner);
router.post("/activation", [postActivationProcess], UserController.activationProcess);
router.post("/repeat-activation-link", [repeatActivationLink], UserController.repeatActivationLink);
router.post("/login", [postLogin, checkRecaptcha], UserController.login);
router.patch("/seed", [checkAuthToken], UserController.changeShowSeedFlag);
router.put("/information", [checkAuthToken, putUserInformation], UserController.setUserPersonalData);
router.get("/", [checkAuthToken, getUserById], UserController.getUserById);
router.put("/password", [putUserPasswordManual], UserController.setUserPassword);
router.put("/info/step", [checkAuthToken], UserController.saveUserStepForm);
router.post("/forgot", [postForgotPassword], UserController.forgotPassword);

export default router;