import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminDonorController from "../../controllers/admin/donorController";
import postAdminDonor from "../../requests/donor/postAdminDonor";
import putAdminDonor from "../../requests/donor/putAdminDonor";

const router = Router();

router.post("/", [checkAdminRole, postAdminDonor], AdminDonorController.create);
router.put("/", [checkAdminRole, putAdminDonor], AdminDonorController.update);

export default router;