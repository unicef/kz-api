import { Router } from "express";
import { acceptRoles } from "../middlewares/acceptRoles";
import FaceRequestController from "../controllers/faceRequestController";

const router = Router();

router.get("/properties", FaceRequestController.getProperties);

export default router;