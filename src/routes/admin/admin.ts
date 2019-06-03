import { Router, Request, Response } from "express";
import partner from "./partner";
import localizationService from "../../services/localization";
import checkAuthToken from "../../middlewares/checkAuthToken";

const routes = Router();

routes.use("/partner", partner);

export default routes;
