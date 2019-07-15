import { Router, Request, Response } from "express";
import partner from "./partner";
import unicef from "./unicef";
import page from "./page";

const routes = Router();

routes.use("/unicef", unicef);
routes.use("/partner", partner);
routes.use("/page", page);

export default routes;
