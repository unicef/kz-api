import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import Sequelize from "sequelize";
import sequelize from "../../services/sequelize";
import Page from "../../models/page";
import ApiController from "../apiController";
import HttpException from "../../exceptions/httpException";
import PageNotFind from "../../exceptions/page/pageNotFind";

class AdminPageController {

    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let pageData = req.body;
            const page = await Page.create(pageData);
    
            return ApiController.success({
                message: i18n.t('successCreatingPage'),
                page: page
            }, res);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
        
    }

    static list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let page = 1;
            const pageCount = 15;
            let responseData = {};
            if (req.query.page !== undefined) {
                page = parseInt(req.query.page);
                if (isNaN(page)) {
                    page = 1;
                }
            }
            let searchInstanse = '';
    
            if (req.query.search && req.query.search!=='') {
                const idSearch = +req.query.search ? +req.query.search : 0;
                searchInstanse = 'WHERE "id" = ' + idSearch +' OR "key" LIKE \'%'+ req.query.search +'%\' OR "titleRu" LIKE \'%'+ req.query.search +'%\' OR "titleEn" LIKE \'%'+ req.query.search +'%\'';
            }
    
            const pagesQuery: Array<{id: number}>|null = await sequelize.query('SELECT "id" FROM pages ' + searchInstanse, {
                type: Sequelize.QueryTypes.SELECT
            });
            
            if (pagesQuery == null || pagesQuery.length < 1) {
                // partners count = 0
                responseData = {pages: []};
    
                return ApiController.success(responseData, res);
            }
    
            const lastPage = Math.ceil(pagesQuery.length / pageCount);
            if (page>lastPage) {
                page = lastPage;
            }
    
            let pagesIds = pagesQuery.map(a => a.id);
    
            let query = 'SELECT * FROM pages WHERE "id" IN (' + pagesIds.join(', ') + ') ORDER BY "id" DESC';
            const offset = pageCount * (page-1);
    
            query = query + ' LIMIT ' + pageCount + ' OFFSET ' + offset;
    
            const pages = await sequelize.query(query,{type: Sequelize.QueryTypes.SELECT});
    
            responseData = {
                pages: pages,
                currentPage: page,
                lastPage: lastPage
            }
    
            return ApiController.success(responseData, res);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static showPage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageId = req.query.id;
            const page = await Page.findByPk(pageId);
    
            if (page == null) {
                throw new PageNotFind();
            }

            return ApiController.success(page, res);
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = await Page.findByPk(req.body.id);
            const pageData = req.body;
            if (page == null) {
                throw new PageNotFind();
            }

            await page.update(pageData);
            return ApiController.success({
                message: i18n.t('successUpdatingPage')
            }, res)

        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }
}

export default AdminPageController;