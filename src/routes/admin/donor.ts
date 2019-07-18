import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminDonorController from "../../controllers/admin/donorController";
import postAdminDonor from "../../requests/donor/postAdminDonor";

const router = Router();

router.post("/", [checkAdminRole, postAdminDonor], AdminDonorController.create);

export default router;