import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import ProgrammeRepository from "../repositories/programmeRepository";
import SettingHelper from "../helpers/settingHelper";
import SectionRepository from "../repositories/sectionRepository";
import UserRepository from "../repositories/userRepository";
import Role from "../models/role";
import HistoryRepository from "../repositories/historyRepository";
import ProjectHelper from "../helpers/projectHelper";
import Project from "../models/project";
import event from "../services/event";
import ProjectWasCreated from "../events/projectWasCreated";
import ProjectDocument from "../models/projectDocument";
import ProjectDocumentsUploaded from "../events/projectDocumentsUploaded";
import User from "../models/user";
import BadRole from "../exceptions/user/badRole";

class ProjectController {

    static testing = async (req: Request, res: Response, next: NextFunction) => {
        const user = {
            id: 1,
            firstNameEn: "Nikolas",
            firstNameRu: "Николай",
            lastNameEn: "Kage",
            lastNameRu: "Кейдж"
        };
        const project = {
            id: 10101010
        };
        const event = {
            action: "created",
            data: {
                field: "title",
                value: "Title title title"
            }
        };

        const history = await HistoryRepository.create(user, project, event);

        return ApiController.success({ history: history }, res);
    }

    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let responseData: any = {};
            if (!req.query.key || req.query.key == 'programmes') {
                const programmes = await ProgrammeRepository.getTree();
                responseData['programmes'] = programmes;
            }
            if (!req.query.key || req.query.key == 'KZTRate') {
                const kztRate: number = SettingHelper.getKZTRate();
                responseData['KZTRate'] = kztRate;
            }
            if (!req.query.key || req.query.key == 'sections') {
                const sections = await SectionRepository.findAll();
                responseData['sections'] = sections;
            }
            if (!req.query.key || req.query.key == 'officers') {
                const officers = await UserRepository.findByRole(Role.unicefResponsibleId);
                responseData['officers'] = officers;
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

    static create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectData = ProjectHelper.getProjectData(req.body);

            // verify role matching
            const officer = await User.findOne({
                where: {
                    id: projectData.officerId
                },
                include: [
                    User.associations.roles,
                    User.associations.personalData
                ]
            });

            if (officer == null || !officer.hasRole(Role.unicefResponsibleId)) {
                throw new BadRole(400, 235, i18n.t('badResponsibleOfficerUser'), 'Creation project> Bad responsible officer user')
            }

            const project = await Project.create(projectData);

            event(new ProjectWasCreated(req.user, project));

            // working with documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                let docsArray: Array<ProjectDocument>|[] = [];
                req.body.documents.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                    if (doc) {
                        docsArray.push(doc);
                    }
                });
                event(new ProjectDocumentsUploaded(req.user, project, docsArray));
            }

            const responseData = {
                message: i18n.t('projectSuccessfullyCreated'),
                projectId: project.id
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
export default ProjectController;