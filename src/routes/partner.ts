import { Router } from "express";
import PartnerController from "../controllers/partnerController";
import checkAuthToken from "../middlewares/checkAuthToken";
import getPartnerById from "../requests/partner/getPartnerById";
import multer from "multer";
import postDocumentUploading from "../requests/partner/postDocumentUploading";
import getPartnerDocuments from "../requests/partner/getPartnerDocuments";
import postPartnerDocuments from "../requests/partner/postPartnerDocuments";
import FileController from "../controllers/fileController";
import { acceptRoles } from "../middlewares/acceptRoles";
import Role from "../models/role";
import ApiController from "../controllers/apiController";

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

router.get("/properties", PartnerController.getPartnerProperties);
router.put("/", [checkAuthToken], PartnerController.updatePartner);
router.get("/", [checkAuthToken, getPartnerById], PartnerController.getPartnerById);
router.patch("/approve", [checkAuthToken], PartnerController.approve);
router.patch("/reject", [checkAuthToken], PartnerController.reject);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], FileController.uploadingTemp);
router.get("/document", [checkAuthToken, getPartnerDocuments], PartnerController.downloadDocument);
router.get("/documents", [checkAuthToken, getPartnerDocuments], PartnerController.getDocuments);
router.post("/documents", [checkAuthToken, postPartnerDocuments], PartnerController.updateDocuments);
router.delete("/document", [checkAuthToken, getPartnerDocuments], PartnerController.deleteDocument);
router.get("/list", [checkAuthToken], PartnerController.list);
router.get("/details", [checkAuthToken, getPartnerById], PartnerController.details);
router.get("/available", [checkAuthToken, middleCheckAdminUnicefRoles], PartnerController.availableList);
router.get("/projects", [checkAuthToken, middleCheckAdminUnicefRoles, getPartnerDocuments], PartnerController.getProjects)

export default router;