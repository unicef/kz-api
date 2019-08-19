import { Router } from "express";
import multer from "multer";
import ProjectController from "../controllers/projectController";
import postProject from "../requests/project/postProject";
import postDocumentUploading from "../requests/partner/postDocumentUploading";
import checkAuthToken from "../middlewares/checkAuthToken";
import { acceptRoles } from "../middlewares/acceptRoles";
import Role from "../models/role";
import FileController from "../controllers/fileController";

const router = Router();
const upload = multer({ 
    dest: 'assets/tmp/', 
    limits: {
        files: 1,
        fileSize: 5242880
    }
});
const middleCheckAdminUnicefRoles = acceptRoles([
    Role.adminRoleId, 
    Role.unicefResponsibleId, 
    Role.unicefBudgetId, 
    Role.unicefDeputyId, 
    Role.unicefOperationId
]);

router.post("/", [checkAuthToken, middleCheckAdminUnicefRoles, postProject], ProjectController.create);
router.get("/test", ProjectController.testing);
router.get("/properties", [checkAuthToken, middleCheckAdminUnicefRoles], ProjectController.getProperties);
router.get("/", [checkAuthToken, middleCheckAdminUnicefRoles], ProjectController.getInfo);
router.get("/documents", [checkAuthToken, middleCheckAdminUnicefRoles], ProjectController.getDocuments);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], FileController.uploadingTemp);

export default router;