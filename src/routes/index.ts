import { Router, Request, Response } from "express";
import localization from "./localization";
import user from "./user";
import file from "./file";
import partner from "./partner";
import project from "./project";
import admin from "./admin/admin";
import request from "./faceRequest";
import localizationService from "../services/localization";
import checkAuthToken from "../middlewares/checkAuthToken";
import UserController from "../controllers/userController";
import BlockchainController from "../controllers/blockchainController";
import PageController from "../controllers/pageController";
import checkAdminRole from "../middlewares/checkAdminRole";

const routes = Router();

routes.use("/", localizationService);
routes.options("/", (req: Request, res: Response) => {
    res.status(200).json({success:true}).send();
    return ;
})
routes.use("/admin", admin);
routes.get("/test-blockchain", BlockchainController.testBlockchain)
routes.get("/me", checkAuthToken, UserController.getMe);
routes.use("/localization", localization);
routes.use("/user", user);
routes.use("/file", file);
routes.use("/partner", partner);
routes.use("/project", project);
routes.use("/request", request);
routes.get("/page", PageController.getPage);
routes.get("/page/list", checkAuthToken, PageController.getList);

routes.post("/wallets/generate", checkAuthToken, BlockchainController.generateUsersWallets);
routes.post("/digicus/deploy", [checkAuthToken, checkAdminRole], BlockchainController.deployDigicus);

export default routes;
