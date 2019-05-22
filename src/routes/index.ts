import { Router, Request, Response } from "express";
import localization from "./localization";
import user from "./user";

const routes = Router();

routes.use("/localization", localization);
routes.use("/user", user);

export default routes;
