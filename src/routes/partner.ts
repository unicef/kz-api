import { Router } from "express";
import PartnerController from "../controllers/partnerController";
import checkAuthToken from "../middlewares/checkAuthToken";
import postPartner from "../requests/partner/postPartner";
import getPartnerById from "../requests/partner/getPartnerById";

const router = Router();


// get all users
router.get("/properties", PartnerController.getPartnerProperties);
router.post("/", [checkAuthToken, postPartner], PartnerController.createPartner);
router.get("/", [checkAuthToken, getPartnerById], PartnerController.getPartnerById);


export default router;