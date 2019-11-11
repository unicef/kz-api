import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import BadValidationException from "../exceptions/badValidationException";
import Page from "../models/page";
import PageNotFind from "../exceptions/page/pageNotFind";
import exceptionHandler from "../services/exceptionHandler";

class PageController {
    static getPage = async (req: Request, res: Response) => {
        try {
            const pageKey = req.query.key;
            if (pageKey === null) {
                throw new BadValidationException(400, 129, i18n.t('keyIsRequiredParam'));
            }
            const page = await Page.findOne({
                where: {
                    key: pageKey
                }
            });
            if (page === null) {
                throw new PageNotFind();
            }

            if (page.id !== 1 && page.id !== 2) {
                // check user auth 
                if (req.user === null) {
                    throw new PageNotFind();
                }
            }
            if (!page.isPublic) {
                throw new PageNotFind();
            }

            const responseData = {
                page: page
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static getList = async (req: Request, res: Response) => {
        try {
            const pagesList = await Page.findAll({
                where: {
                    isPublic: true
                }, 
                attributes: [
                    'key', 'titleRu', 'titleEn'
                ]
            });

            const responseData = {
                pages: pagesList
            };
            
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default PageController;