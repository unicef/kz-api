import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import Project from "../models/project";
import ProjectNotFound from "../exceptions/project/projectNotFound";
import Role from "../models/role";
import BadPermissions from "../exceptions/badPermissions";
import ProjectLink from "../models/projectLink";
import BadValidationException from "../exceptions/badValidationException";
import event from "../services/event";
import ProjectLinkAdded from "../events/projectLinkAdded";
import exceptionHandler from "../services/exceptionHandler";

class ProjectLinkController {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.body.projectId;
            const href = req.body.link;
            // get project
            const project = await Project.findByPk(projectId);
            if (project === null) {
                throw new ProjectNotFound();
            }
            // check user permissions
            // if it's partner
            if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
                // check is this partner assigned to project
                if (req.user.partnerId !== project.partnerId) {
                    throw new BadPermissions();
                }
            }
            // check if link allready exists
            const linkExists = await ProjectLink.findOne({
                where: {
                    projectId: projectId,
                    href: href
                }
            });
            if (linkExists !== null) {
                throw new BadValidationException(400, 132, i18n.t('linkAllreadyExists'), 'Link allready created');
            }

            // create link
            const linkData = {
                projectId: project.id,
                userId: req.user.id,
                href: href,
                title: href
            };
            const link = await ProjectLink.create(linkData);
            event(new ProjectLinkAdded(req.user, project, link));
            const responseData = {
                message: i18n.t('linkSuccessfullyCreated'),
                linkId: link.id
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }

    static projectLinksList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.query.projectId;
            const project = await Project.findByPk(projectId);
            if (project === null) {
                throw new ProjectNotFound();
            }
            // check user permissions
            // if it's partner
            if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
                // check is this partner assigned to project
                if (req.user.partnerId !== project.partnerId) {
                    throw new BadPermissions();
                }
            }
            const projectLinksList = await ProjectLink.findAll({
                attributes: ['href', 'title'],
                where: {
                    projectId: projectId
                },
                order: [['createdAt', 'DESC']]
            })

            const responseData = {
                links: projectLinksList
            };

            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default ProjectLinkController;