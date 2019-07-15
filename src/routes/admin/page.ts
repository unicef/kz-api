import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminPageController from "../../controllers/admin/pageController";
import postAdminPage from "../../requests/page/postAdminPage";

const router = Router();

router.post("/", [checkAdminRole, postAdminPage], AdminPageController.create);

export default router;