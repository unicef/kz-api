import { Router } from "express";
import multer from "multer";
import ProjectController from "../controllers/projectController";
import ProjectLinkController from "../controllers/projectLinkController";
import postProject from "../requests/project/postProject";
import postDocumentUploading from "../requests/partner/postDocumentUploading";
import checkAuthToken from "../middlewares/checkAuthToken";
import { acceptRoles } from "../middlewares/acceptRoles";
import Role from "../models/role";
import FileController from "../controllers/fileController";
import putProject from "../requests/project/putProject";
import postProgress from "../requests/project/postProgress";
import getPartnerDocuments from "../requests/partner/getPartnerDocuments";
import postLink from "../requests/projectLink/postlink";
import getProjectLinks from "../requests/projectLink/getProjectLinks";
import getShortProjectInfo from "../requests/project/getShortProjectInfo";

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


const middleCheckAdminUnicefDonorRoles = acceptRoles([
    Role.adminRoleId, 
    Role.unicefResponsibleId, 
    Role.unicefBudgetId, 
    Role.unicefDeputyId, 
    Role.unicefOperationId,
    Role.donorId
]);

const middleCheckAdminUnicefPartnerRoles = acceptRoles([
    Role.adminRoleId, 
    Role.unicefResponsibleId, 
    Role.unicefBudgetId, 
    Role.unicefDeputyId, 
    Role.unicefOperationId,
    Role.partnerAssistId,
    Role.partnerAuthorisedId
]);

const middleChekUnicefPartnerRoles = acceptRoles([
    Role.unicefResponsibleId, 
    Role.unicefBudgetId, 
    Role.unicefDeputyId, 
    Role.unicefOperationId,
    Role.partnerAssistId,
    Role.partnerAuthorisedId
]);

router.post("/", [checkAuthToken, middleCheckAdminUnicefRoles, postProject], ProjectController.create);
router.put("/", [checkAuthToken, middleCheckAdminUnicefRoles, putProject], ProjectController.update);
router.get("/test", ProjectController.testing);
router.get("/properties", [checkAuthToken], ProjectController.getProperties);
router.get("/", [checkAuthToken], ProjectController.getInfo);
router.get("/short", [checkAuthToken, getShortProjectInfo], ProjectController.getShortInfo);
router.post("/progress", [checkAuthToken, middleCheckAdminUnicefRoles, postProgress], ProjectController.progress);
router.get("/my-list", [checkAuthToken, middleChekUnicefPartnerRoles], ProjectController.myList);
router.get("/list", [checkAuthToken, middleCheckAdminUnicefDonorRoles], ProjectController.getList);

// documents routes block
router.get("/documents", [checkAuthToken], ProjectController.getDocuments);
router.get("/document", [checkAuthToken, getPartnerDocuments], ProjectController.downloadDocument);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], FileController.uploadingTemp);
router.delete("/document", [checkAuthToken, middleCheckAdminUnicefRoles], ProjectController.deleteDocument);

// links routes block
router.post("/link", [checkAuthToken, middleCheckAdminUnicefPartnerRoles, postLink], ProjectLinkController.create);
router.get("/links", [checkAuthToken, getProjectLinks], ProjectLinkController.projectLinksList);

// tranches routes block
router.get("/tranches", [checkAuthToken, getPartnerDocuments], ProjectController.getTranches);

// history routes block
router.get("/history", [checkAuthToken, getPartnerDocuments], ProjectController.getShortHistory);
router.get("/history-file", [checkAuthToken, getPartnerDocuments], ProjectController.downloadHistory);
router.get("/faces", [checkAuthToken], ProjectController.getFaces);
router.get("/reports", [checkAuthToken], ProjectController.getReports);

export default router;