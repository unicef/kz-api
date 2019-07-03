import { Router, Response } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminUnicefController from "../../controllers/admin/unicefController";
import postUnicefUser from "../../requests/unicef/postUnicefUser";
import putUnicefUser from "../../requests/unicef/putUnicefUser";

const router = Router();

router.get("/properties", [checkAdminRole], AdminUnicefController.getProperties);
router.post("/", [checkAdminRole, postUnicefUser], AdminUnicefController.create);
router.put("/", [checkAdminRole, putUnicefUser], AdminUnicefController.update)

export default router;