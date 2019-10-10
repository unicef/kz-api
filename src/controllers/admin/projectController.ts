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
import ProjectHelper from "../../helpers/projectHelper";
import exceptionHandler from "../../services/exceptionHandler";

class AdminProjectController {

    static terminateReasons = async (req: Request, res: Response) => {
        const LANG: string = i18n.language;

        const reasons = ProjectHelper.terminationReasons;
        try {
            let responseReasons: Array<object>|[] = [];
            reasons.forEach((reason) => {
                if (reason[LANG]) {
                    const langReason = {
                        key: reason.key,
                        title: reason[LANG]
                    };
                    responseReasons.push(langReason);
                }
            })
    
            const responseData = {
                reasons: responseReasons
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
        
    }
    
    static terminate = async (req: Request, res: Response) => {
        try {
            const projectId = req.body.id;
            const terminationReasonKey = req.body.reason.key;
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
            
            event(new ProjectWasTerminated(req.user, project, terminationReasonKey));

            const responseData = {
                message: i18n.t('successProjectTermination')
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
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
                message: i18n.t('successDeletedProject')
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            return exceptionHandler(error, res);
        }
    }
}

export default AdminProjectController;