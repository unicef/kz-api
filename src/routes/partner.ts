import { Router } from "express";
import PartnerController from "../controllers/partnerController";
import checkAuthToken from "../middlewares/checkAuthToken";

const router = Router();


// get all users
router.get("/properties", PartnerController.getPartnerProperties);


export default router;