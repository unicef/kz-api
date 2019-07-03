import { Router, Response } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminUnicefController from "../../controllers/admin/unicefController";
import postUnicefUser from "../../requests/unicef/postUnicefUser";

const router = Router();

router.get("/properties", [checkAdminRole], AdminUnicefController.getProperties);
router.post("/", [checkAdminRole, postUnicefUser], AdminUnicefController.create);

export default router;