import { Router } from "express";
import { acceptRoles } from "../middlewares/acceptRoles";
import FaceRequestController from "../controllers/faceRequestController";
import getRequestProperties from "../requests/faceRequest/getRequestProperties";
import checkAuthToken from "../middlewares/checkAuthToken";
import Role from "../models/role";
import { middleware as postRequest } from "../requests/faceRequest/testRequest";

const router = Router();

const middleCheckAssistantRole = acceptRoles([
    Role.partnerAssistId
]);

router.get("/properties", [checkAuthToken], FaceRequestController.getProperties);
router.post("/", [checkAuthToken, middleCheckAssistantRole, postRequest], FaceRequestController.create);

export default router;