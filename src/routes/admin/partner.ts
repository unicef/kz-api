import { Router } from "express";
import AdminPartnerController from "../../controllers/admin/partnerController";
import checkAdminRole from "../../middlewares/checkAdminRole";
import postAdminPartner from "../../requests/user/postAdminPartner";
import putAdminPartner from "../../requests/partner/putAdminPartner";
import patchPartnerBlocking from "../../requests/partner/patchPartnerBlocking";

const router = Router();


// get all users
router.post("/", [checkAdminRole, postAdminPartner], AdminPartnerController.createPartner);
router.put("/", [checkAdminRole, putAdminPartner], AdminPartnerController.updatePartner);
router.get("/list", [checkAdminRole], AdminPartnerController.getPartnersList);
router.patch("/block", [checkAdminRole, patchPartnerBlocking], AdminPartnerController.block);


export default router;