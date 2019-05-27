import { Router, Request, Response } from "express";
import localization from "./localization";
import user from "./user";
import localizationService from "../services/localization";
import checkAuthToken from "../middlewares/checkAuthToken";
import UserController from "../controllers/userController";

const routes = Router();

routes.use("/", localizationService);
routes.get("/me", checkAuthToken, UserController.getMe);
routes.use("/localization", localization);
routes.use("/user", user);

export default routes;
