import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminUnicefController from "../../controllers/admin/unicefController";

const router = Router();

// get all users
router.get("/properties", [checkAdminRole], AdminUnicefController.getProperties);

export default router;