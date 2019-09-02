import { Router, Request, Response } from "express";
import partner from "./partner";
import unicef from "./unicef";
import page from "./page";
import donor from "./donor";
import project from "./project";

const routes = Router();

routes.use("/unicef", unicef);
routes.use("/partner", partner);
routes.use("/page", page);
routes.use("/donor", donor);
routes.use("/project", project)

export default routes;
