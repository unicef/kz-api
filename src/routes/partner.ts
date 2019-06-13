import { Router } from "express";
import PartnerController from "../controllers/partnerController";
import checkAuthToken from "../middlewares/checkAuthToken";
import postPartner from "../requests/partner/postPartner";
import getPartnerById from "../requests/partner/getPartnerById";
import multer from "multer";
import postDocumentUploading from "../requests/partner/postDocumentUploading";

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
router.get("/", [checkAuthToken, getPartnerById], PartnerController.getPartnerById);
router.post("/document", [checkAuthToken, upload.single('file'), postDocumentUploading], PartnerController.uploadingDocument);

export default router;