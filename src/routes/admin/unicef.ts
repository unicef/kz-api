import { Router, Response } from "express";
import checkAdminRole from "../../middlewares/checkAdminRole";
import AdminUnicefController from "../../controllers/admin/unicefController";

const router = Router();

router.get("/", (res: Response) => {
    res.json({fuck: "You"})
})
router.get("/properties", [checkAdminRole], AdminUnicefController.getProperties);

export default router;