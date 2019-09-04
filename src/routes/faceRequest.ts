import { Router } from "express";
import { acceptRoles } from "../middlewares/acceptRoles";
import FaceRequestController from "../controllers/faceRequestController";
import getRequestProperties from "../requests/faceRequest/getRequestProperties";
import checkAuthToken from "../middlewares/checkAuthToken";

const router = Router();

router.get("/properties", [checkAuthToken, getRequestProperties], FaceRequestController.getProperties);

export default router;