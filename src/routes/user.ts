import { Router } from "express";
import UserController from "../controllers/userController";
import postNewPartner from "../requests/user/postNewPartner";
import { checkRecaptcha } from "../middlewares/checkRecaptcha";
import postActivationProcess from "../requests/user/postActivationProcess";

const router = Router();


// get all users
router.get("/", UserController.getUsersList);
router.post("/partner", [postNewPartner, checkRecaptcha], UserController.createPartner);
router.post("/activation", [postActivationProcess], UserController.activationProcess);


export default router;