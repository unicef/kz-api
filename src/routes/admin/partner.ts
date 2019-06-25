import { Router } from "express";
import AdminPartnerController from "../../controllers/admin/partnerController";
import checkAdminRole from "../../middlewares/checkAdminRole";
import postAdminPartner from "../../requests/user/postAdminPartner";
import putAdminPartner from "../../requests/partner/putAdminPartner";

const router = Router();


// get all users
router.post("/", [checkAdminRole, postAdminPartner], AdminPartnerController.createPartner);
router.put("/", [checkAdminRole, putAdminPartner], AdminPartnerController.updatePartner);


export default router;