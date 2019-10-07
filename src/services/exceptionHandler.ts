import { Response } from "express";
import { captureException } from "@sentry/node";
import HttpException from "../exceptions/httpException";
import ApiController from "../controllers/apiController";

export default function (error: Error, res: Response) {
    if (error instanceof HttpException) {
        error.response(res);
    } else {
        captureException(error);
        ApiController.failed(500, error.message, res);
    }
}