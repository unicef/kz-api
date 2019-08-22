import { Request, Response } from "express";
import ApiController from "../apiController";
import HttpException from "../../exceptions/httpException";
import Project from "../../models/project";
import ProjectNotFound from "../../exceptions/project/projectNotFound";
import BadProjectStatus from "../../exceptions/project/badProjectStatus";
import ProjectTranche from "../../models/projectTranche";
import event from "../../services/event";
import ProjectWasTerminated from "../../events/projectWasTerminated";
import i18n from "i18next";
import ProjectDocument from "../../models/projectDocument";
import HistoryRepository from "../../repositories/historyRepository";

class AdminProjectController {
    
    static terminate = async (req: Request, res: Response) => {
        try {
            const projectId = req.body.id;
            const project = await Project.findByPk(projectId);
            if (project === null) {
                throw new ProjectNotFound();
            }

            // check project status
            if (project.statusId !== Project.IN_PROGRESS_STATUS_ID) {
                throw new BadProjectStatus();
            }
            const projectTranches = await ProjectTranche.findAll({
                where: {
                    projectId: projectId
                }
            });

            project.statusId = Project.TERMINATION_STATUS_ID;
            await project.save();

            projectTranches.forEach((tranche) => {
                tranche.status = ProjectTranche.DONE_STATUS_KEY
                tranche.save();
            });
            
            event(new ProjectWasTerminated(req.user, project));

            const responseData = {
                message: i18n.t('successProjectTermination')
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static delete = async (req: Request, res: Response) => {
        try {
            const projectId = req.query.id;
            const project = await Project.findByPk(projectId);
            if (project === null) {
                throw new ProjectNotFound();
            }

            // check project status
            if (project.statusId !== Project.CREATED_STATUS_ID) {
                throw new BadProjectStatus();
            }
            // delete project
            project.destroy();
            // delete project files
            const projectFiles = await ProjectDocument.findAll({
                where: {
                    projectId: projectId
                }
            });
            if (projectFiles.length > 0) {
                projectFiles.forEach((projectFile: ProjectDocument) => {
                    projectFile.deleteFile();
                })
            }
            // delete project history
            await HistoryRepository.deleteByProjectId(projectId);

            const responseData = {
                message: i18n.t('successDeletedProject');
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }
}

export default AdminProjectController;