import { Router } from "express";
import FileController from "../controllers/fileController";
import checkAuthToken from "../middlewares/checkAuthToken";

const router = Router();

// get file by ID
router.get("/", FileController.getFile);


export default router;