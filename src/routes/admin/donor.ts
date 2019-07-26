import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminDonorController from "../../controllers/admin/donorController";
import postAdminDonor from "../../requests/donor/postAdminDonor";
import putAdminDonor from "../../requests/donor/putAdminDonor";
import patchDonorBlock from "../../requests/donor/patchDonorBlock";

const router = Router();

router.post("/", [checkAdminRole, postAdminDonor], AdminDonorController.create);
router.put("/", [checkAdminRole, putAdminDonor], AdminDonorController.update);
router.patch("/block", [checkAdminRole, patchDonorBlock], AdminDonorController.block);
router.get("/list", [checkAdminRole], AdminDonorController.list);

export default router;