import { Router } from "express";
import AdminProjectController from "../../controllers/admin/projectController";
import patchProjectTermination from "../../requests/project/patchProjectTermination";
import checkAuthToken from "../../middlewares/checkAuthToken";
import { acceptRoles } from "../../middlewares/acceptRoles";
import Role from "../../models/role";
import deleteProject from "../../requests/project/deleteProject";

const router = Router();

const middleCheckAdminRole = acceptRoles([
    Role.adminRoleId
]);



// get all users
router.patch("/terminate", [checkAuthToken, middleCheckAdminRole, patchProjectTermination], AdminProjectController.terminate);
router.delete("/", [checkAuthToken, middleCheckAdminRole, deleteProject], AdminProjectController.delete);

export default router;