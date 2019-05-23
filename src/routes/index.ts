import { Router, Request, Response } from "express";
import localization from "./localization";
import user from "./user";
import localizationService from "../services/localization";

const routes = Router();

routes.use("/", localizationService);
routes.use("/localization", localization);
routes.use("/user", user);

export default routes;
