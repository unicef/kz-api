import { Router } from "express";
import UserController from "../controllers/userController";
import postNewPartner from "../requests/user/postNewPartner";
import { checkRecaptcha } from "../middlewares/checkRecaptcha";

const router = Router();


// get all users
router.get("/", UserController.getUsersList);
router.post("/partner", [postNewPartner, checkRecaptcha], UserController.createPartner);


export default router;