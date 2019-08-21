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
import BadValidationException from "../exceptions/badValidationException";
import ProjectRepository from "../repositories/projectRepository";
import ProjectNotFound from "../exceptions/project/projectNotFound";
import ProjectDocumentNotFound from "../exceptions/project/projectDocumentNotFound";
import BadProjectStatus from "../exceptions/project/badProjectStatus";
import ProjectDocumentDeleted from "../events/projectDocumentDeleted";
import NeedAnotherProjectType from "../exceptions/project/needAnotherProjectType";
import ProjectWasUpdated from "../events/projectWasUpdated";
import Partner from "../models/partner";
import PartnerNotFind from "../exceptions/partner/partnerNotFind";
import PartnerNotTrusted from "../exceptions/partner/partnerNotTrusted";
import PartnerProjectsLimit from "../exceptions/project/partnerProjectsLimit";
import ProjectTrancheRepository from "../repositories/projectTrancheRepository";
import ProjectHasTranches from "../exceptions/project/projectHasTranches";
import ProjectTranche from "../models/projectTranche";
import GenerateDocsHash from "../listeners/project/generateDocsHash";

class ProjectController {

    static testing = async (req: Request, res: Response, next: NextFunction) => {
        const history = await HistoryRepository.getList();

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
                const usdRate: number = SettingHelper.getUSDRate();
                responseData['usdRate'] = usdRate;
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

            if (officer == null || !officer.hasRole(Role.unicefResponsibleId) || officer.isBlocked || officer.emailVerifiedAt===null) {
                throw new BadRole(400, 235, i18n.t('badResponsibleOfficerUser'), 'Creation project> Bad responsible officer user')
            }

            const project = await Project.create(projectData);

            event(new ProjectWasCreated(req.user, project));

            // working with documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                let docsArray: Array<ProjectDocument> | [] = [];
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

    static getInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.query.id || false;
            if (!projectId) {
                throw new BadValidationException(400, 112, i18n.t('projectIdRequired'), 'id param is required');
            }

            // get project info
            const project = await ProjectRepository.findById(projectId);

            if (project === null) {
                throw new ProjectNotFound();
            }

            return ApiController.success({ project: project }, res);
        } catch (error) {
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
            const projectId = req.body.id;
            const project = await Project.findByPk(projectId);

            if (project === null) {
                throw new ProjectNotFound();
            }
            // system can edit the project only in the status created
            if (project.statusId !== Project.CREATED_STATUS_ID) {
                throw new BadProjectStatus();
            }
            // get project data from request
            const projectData = ProjectHelper.getProjectData(req.body);
            // If the project budget requires type changes
            if (projectData.type !== project.type) {
                throw new NeedAnotherProjectType();
            }
            if (projectData.officerId !== project.officerId) {
                // check if officer user has needed role
                const officer = await User.findOne({
                    where: {
                        id: projectData.officerId
                    },
                    include: [
                        User.associations.roles,
                        User.associations.personalData
                    ]
                });
    
                if (officer == null || !officer.hasRole(Role.unicefResponsibleId) || officer.isBlocked || officer.emailVerifiedAt===null) {
                    throw new BadRole(400, 235, i18n.t('badResponsibleOfficerUser'), 'Creation project> Bad responsible officer user')
                }
            }

            Project.afterUpdate((prj, opt) => {
                event(new ProjectWasUpdated(req.user, project, prj._previousDataValues, prj.dataValues, opt.fields));
            });

            await project.update(projectData);

            // working with documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                let docsArray: Array<ProjectDocument> | [] = [];
                req.body.documents.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                    console.log("DOCUMENT!!!", doc);
                    if (doc) {
                        docsArray.push(doc);
                    }
                });
                console.log('DOC_ARRAY', docsArray);
                event(new ProjectDocumentsUploaded(req.user, project, docsArray));
            }

            return ApiController.success({message: i18n.t('projectSuccessfullyUpdated')}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static progress = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const partnerId = req.body.partner.id;
            // check partner
            const partner = await Partner.findOne({where:{id:partnerId}});
            if (partner === null) {
                throw new PartnerNotFind();
            }
            // check partner status
            if (partner.statusId !== Partner.partnerStatusApproved) {
                throw new PartnerNotTrusted();
            }
            // get partner projects and count it
            const partnerProjects = await partner.getProjects();
            if (partnerProjects.length >= Partner.PROJECTS_LIMIT) {
                throw new PartnerProjectsLimit();
            }
            // working with project
            const projectId = req.body.id;
            const project = await Project.findByPk(projectId);
            if (project === null) {
                throw new ProjectNotFound();
            }
            if (project.statusId != Project.CREATED_STATUS_ID) {
                throw new BadProjectStatus();
            }

            // working with tranches
            // get project tranches
            const projectTranches = await ProjectTrancheRepository.findByProjectId(projectId);
            if (projectTranches.length > 0) {
                throw new ProjectHasTranches();
            }
            const inputTranches: any = req.body.tranches;
            const tranchesData = await ProjectHelper.getTranchesData(project, inputTranches);
            const Tranches = await ProjectTranche.bulkCreate(tranchesData);
            // working with documents
            const inputDocs = req.body.documents;
            const isDocsValid = await ProjectHelper.validateDocumentsData(project, inputDocs);

            if (isDocsValid) {
                let docsArray: Array<ProjectDocument> | [] = [];
                inputDocs.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                    if (doc) {
                        docsArray.push(doc);
                    }
                });
                event(new ProjectDocumentsUploaded(req.user, project, docsArray));
            }
            // change project status
            project.statusId = Project.IN_PROGRESS_STATUS_ID;
            project.partnerId = partner.id;
            await project.save();

            const responseProject = await ProjectRepository.findById(project.id);

            return ApiController.success({ message: i18n.t('IPSuccessfullySelected'), project: responseProject }, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
        // request body

        // partnerId
        // docs
        // tranches

    }

    static getDocuments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.query.id || false;
            if (!projectId) {
                throw new BadValidationException(400, 112, i18n.t('projectIdRequired'), 'id param is required');
            }
            const isProjectExists = await ProjectRepository.isProjectExists(projectId);
            if (!isProjectExists) {
                throw new ProjectNotFound();
            }

            // get project documents
            const projectDocuments = await ProjectDocument.findAll({
                where: {
                    projectId: projectId
                }
            })

            let responseData: any = [];

            if (projectDocuments instanceof Array && projectDocuments.length>0) {
                projectDocuments.forEach((element) => {
                    responseData.push({
                        href: element.href,
                        id: element.id,
                        title: element.title
                    })
                })
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

    static deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectDocId = req.query.id || false;
            if (!projectDocId) {
                throw new BadValidationException(400, 112, i18n.t('documentIdRequired'), 'id param is required');
            }

            const projectDoc = await ProjectDocument.findOne({
                where: {
                    id: projectDocId
                }
            });
            if (projectDoc === null) {
                throw new ProjectDocumentNotFound();
            }
            const projectId = projectDoc.projectId;
            const project = await Project.findOne({
                where: {
                    id: projectId
                }
            });

            if (project === null) {
                throw new ProjectNotFound();
            }

            if (project && project.statusId !== Project.CREATED_STATUS_ID) {
                throw new BadProjectStatus();
            }

            event(new ProjectDocumentDeleted(req.user, project, projectDoc));

            // delete project document
            projectDoc.destroy();

            return ApiController.success({message: i18n.t('successProjectDocDelete')}, res);
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