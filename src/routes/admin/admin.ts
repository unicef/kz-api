import { Router, Request, Response } from "express";
import partner from "./partner";
import unicef from "./unicef";
import localizationService from "../../services/localization";
import checkAuthToken from "../../middlewares/checkAuthToken";
import router from "./partner";

const routes = Router();

routes.use("/unicef", unicef);
routes.use("/partner", partner);

export default routes;
