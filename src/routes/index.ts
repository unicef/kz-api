import { Router, Request, Response } from "express";
import localization from "./localization";
import user from "./user";
import file from "./file";
import partner from "./partner";
import admin from "./admin/admin";
import localizationService from "../services/localization";
import checkAuthToken from "../middlewares/checkAuthToken";
import UserController from "../controllers/userController";

const routes = Router();

routes.use("/", localizationService);
routes.options("/", (req: Request, res: Response) => {
    res.status(200).json({success:true}).send();
    return ;
})
routes.get("/me", checkAuthToken, UserController.getMe);
routes.use("/localization", localization);
routes.use("/user", user);
routes.use("/file", file);
routes.use("/partner", partner);
routes.use("/admin", admin);

export default routes;
