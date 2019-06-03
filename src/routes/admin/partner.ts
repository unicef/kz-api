import { Router } from "express";
import AdminPartnerController from "../../controllers/admin/partnerController";
import checkAdminRole from "../../middlewares/checkAdminRole";
import postAdminPartner from "../../requests/user/postAdminPartner";

const router = Router();


// get all users
router.post("/", [checkAdminRole, postAdminPartner], AdminPartnerController.createPartner);


export default router;