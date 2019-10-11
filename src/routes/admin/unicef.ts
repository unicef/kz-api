import { Router, Response } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminUnicefController from "../../controllers/admin/unicefController";
import postUnicefUser from "../../requests/unicef/postUnicefUser";
import putUnicefUser from "../../requests/unicef/putUnicefUser";
import patchPartnerBlocking from "../../requests/partner/patchPartnerBlocking";
import { middleware as patchUnicefMakeAdmin } from "../../requests/unicef/patchUnicefMakeAdmin";
import { middleware as patchUnicefUnmakeAdmin } from "../../requests/unicef/patchUnicefUnmakeAdmin";

const router = Router();

router.get("/properties", [checkAdminRole], AdminUnicefController.getProperties);
router.post("/", [checkAdminRole, postUnicefUser], AdminUnicefController.create);
router.put("/", [checkAdminRole, putUnicefUser], AdminUnicefController.update);
router.patch("/block", [checkAdminRole, patchPartnerBlocking], AdminUnicefController.block);
router.patch("/make-admin", [checkAdminRole, patchUnicefMakeAdmin], AdminUnicefController.makeAdmin);
router.patch("/unmake-admin", [checkAdminRole, patchUnicefUnmakeAdmin], AdminUnicefController.unmakeAdmin);

router.get("/list", [checkAdminRole], AdminUnicefController.getUnicefList);

export default router;