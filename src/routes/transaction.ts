import { Router } from "express";
import FileController from "../controllers/fileController";
import checkAuthToken from "../middlewares/checkAuthToken";
import ProjectController from "../controllers/projectController";

const router = Router();

// get transaction list
router.get("/list", [checkAuthToken], ProjectController.getTransactionsList);


export default router;