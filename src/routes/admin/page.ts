import { Router } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminPageController from "../../controllers/admin/pageController";
import postAdminPage from "../../requests/page/postAdminPage";
import putAdminPage from "../../requests/page/putAdminPage";
import getAdminPage from "../../requests/page/getAdminPage";

const router = Router();

router.post("/", [checkAdminRole, postAdminPage], AdminPageController.create);
router.put("/", [checkAdminRole, putAdminPage], AdminPageController.update);
router.get("/", [checkAdminRole, getAdminPage], AdminPageController.showPage);
router.get("/list", [checkAdminRole], AdminPageController.list);

export default router;