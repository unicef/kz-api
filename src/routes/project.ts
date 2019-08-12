import { Router } from "express";
import ProjectController from "../controllers/projectController";

const router = Router();

router.get("/properties", ProjectController.getProperties);

export default router;