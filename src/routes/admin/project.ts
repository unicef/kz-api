import { Router } from "express";
import AdminProjectController from "../../controllers/admin/projectController";
import patchProjectTermination from "../../requests/project/patchProjectTermination";
import checkAuthToken from "../../middlewares/checkAuthToken";
import { acceptRoles } from "../../middlewares/acceptRoles";
import Role from "../../models/role";

const router = Router();

const middleCheckAdminRole = acceptRoles([
    Role.adminRoleId
]);



// get all users
router.patch("/terminate", [checkAuthToken, middleCheckAdminRole, patchProjectTermination], AdminProjectController.terminate);

export default router;