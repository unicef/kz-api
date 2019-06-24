import { Router } from "express";
import PartnerController from "../controllers/partnerController";
import checkAuthToken from "../middlewares/checkAuthToken";
import postPartner from "../requests/partner/postPartner";
import getPartnerById from "../requests/partner/getPartnerById";
import multer from "multer";
import postDocumentUploading from "../requests/partner/postDocumentUploading";
import getPartnerDocuments from "../requests/partner/getPartnerDocuments";

const router = Router();
const upload = multer({ 
    dest: 'assets/tmp/', 
    limits: {
        files: 1,
        fileSize: 5242880
    }
});


// get all users
router.get("/properties", PartnerController.getPartnerProperties);
router.post("/", [checkAuthToken, postPartner], PartnerController.createPartner);
router.put("/", [checkAuthToken], PartnerController.updatePartner);
router.get("/", [checkAuthToken, getPartnerById], PartnerController.getPartnerById);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], PartnerController.uploadingDocument);
router.get("/document", [checkAuthToken, getPartnerDocuments], PartnerController.downloadDocument);
router.get("/documents", [checkAuthToken, getPartnerDocuments], PartnerController.getDocuments);
router.post("/documents", [checkAuthToken], PartnerController.getDocuments);
router.delete("/document", [checkAuthToken, getPartnerDocuments], PartnerController.deleteDocument)

export default router;