import { Router } from "express";
import { acceptRoles } from "../middlewares/acceptRoles";
import FaceRequestController from "../controllers/faceRequestController";
import getRequestProperties from "../requests/faceRequest/getRequestProperties";
import checkAuthToken from "../middlewares/checkAuthToken";
import Role from "../models/role";
import multer from "multer";
import postDocumentUploading from "../requests/partner/postDocumentUploading";
import { middleware as postReport } from "../requests/faceReport/postCreateReport";
import { middleware as putUpdateRequest } from "../requests/faceRequest/putUpdateRequest";
import { middleware as getActivitiesReport } from "../requests/faceReport/getReportActivitiesRequest";
import { middleware as getReport } from "../requests/faceReport/getReport";
import { middleware as postRequestApprove } from "../requests/faceRequest/postRequestApprove";
import FaceReportController from "../controllers/faceReportController";
import FileController from "../controllers/fileController";

const router = Router();

const upload = multer({ 
    dest: 'assets/tmp/', 
    limits: {
        files: 1,
        fileSize: 5242880
    }
});

const middleCheckAssistantRole = acceptRoles([
    Role.partnerAssistId
]);
const middleCheckPartnerUnicefRole = acceptRoles([
    Role.partnerAuthorisedId,
    Role.unicefResponsibleId,
    Role.unicefBudgetId,
    Role.unicefDeputyId,
    Role.unicefOperationId
]);

const middleCheckUnicefUser = acceptRoles([
    Role.unicefResponsibleId,
    Role.unicefBudgetId,
    Role.unicefDeputyId,
    Role.unicefOperationId
])

router.get("/properties", [checkAuthToken], FaceReportController.getProperties);
router.get("/activities", [checkAuthToken, getActivitiesReport], FaceReportController.getActivities);
router.post("/", [checkAuthToken, middleCheckAssistantRole, postReport], FaceReportController.create);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], FileController.uploadingTemp);
router.get("/", [checkAuthToken, getReport], FaceReportController.getReport);

export default router;