import { Request, Response, NextFunction } from "express";
import i18n from "i18next";
import fs from "fs";
import cryptoRandomString from "crypto-random-string";
import mime from "mime-types";
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
import ProjectPartnerAssigned from "../events/projectPartnerAssigned";
import ProjectTranchesInstalled from "../events/projectTranchesInstalled";
import ProjectHistoryHelper from "../helpers/projectHistoryHelper";
import Pagination from "../services/pagination";
import BadPermissions from "../exceptions/badPermissions";

class ProjectController {

    static testing = async (req: Request, res: Response, next: NextFunction) => {
        const projectId = parseInt(req.query.id);
        const history = await HistoryRepository.getList(projectId, 10);

        let histResp = await ProjectHistoryHelper.renderHistory(history);

        return ApiController.success({ history: histResp }, res);
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

    static myList = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // check user role and get list for this role
            const user = req.user;
            let list: any = [];
            if (user.hasRole(Role.partnerAssistId) || user.hasRole(Role.partnerAuthorisedId)) {
                list = await ProjectHelper.getMyPartnerList(req);
            } else if (user.hasRole(Role.unicefResponsibleId)) {
                list = await ProjectHelper.getMyAssistantList(req);
            }

            return ApiController.success(list, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getList = async (req: Request, res: Response, next: NextFunction) => {
        try { 
            let pagination = new Pagination(req, 15);
            let searchInstanse = req.query.search?req.query.search:null;

            const projects = await ProjectRepository.getAllList(searchInstanse, pagination);


            const responseData = {
                projects: projects,
                currentPage: pagination.getCurrentPage(),
                lastPage: pagination.getLastPage()
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
                req.body.documents.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                });
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

            if (req.user.hasRole(Role.partnerAssistId) || req.user.hasRole(Role.partnerAuthorisedId)) {
                if (req.user.partnerId !== project.partnerId) {
                    throw new BadPermissions();
                }
            }

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

    static getShortInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projectId = req.query.id;
            const projectInfo = await ProjectRepository.shortInfoById(projectId);

            if (projectInfo === null) {
                throw new ProjectNotFound();
            }
            
            const responseData = {
                project: projectInfo
            };

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
            // event of editing project
            event(new ProjectWasUpdated(req.user, project, projectData));

            await project.update(projectData);

            // working with documents
            if (req.body.documents instanceof Array && req.body.documents.length > 0) {
                req.body.documents.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                });
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
            // working with documents
            const inputDocs = req.body.documents;
            const isDocsValid = await ProjectHelper.validateDocumentsData(project, inputDocs);
            const inputTranches: any = req.body.tranches;
            const tranchesData = await ProjectHelper.getTranchesData(project, inputTranches);
            const tranches = await ProjectTranche.bulkCreate(tranchesData);

            if (isDocsValid) {
                inputDocs.forEach(async (element: any) => {
                    let doc = await ProjectHelper.transferProjectDocument(element.id, element.title, project);
                });
            }
            // change project status
            project.statusId = Project.IN_PROGRESS_STATUS_ID;
            project.partnerId = partner.id;
            await project.save();
            event(new ProjectPartnerAssigned(req.user, project, partner));
            event(new ProjectTranchesInstalled(req.user, project, tranches));

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

    
    static downloadDocument = async (req: Request, res: Response) => {
        try {
            const documentId = req.query.id;

            const projectDocument = await ProjectDocument.findByPk(documentId);
            if (projectDocument == null) {
                throw new PartnerNotFind(400, 110, i18n.t('documentNotFindError'), 'Document not found');
            }
    
            const filePath = projectDocument.getFilePath();
            const fileBuffer = fs.readFileSync(filePath);

            const base64 = Buffer.from(fileBuffer).toString('base64');
            const contentType = mime.contentType(projectDocument.getPublicFilename());
            if (contentType) {
                const responseData = {
                        filename : projectDocument.getPublicFilename(),
                        contentType: contentType,
                        doc: base64
                    };
                ApiController.success(responseData, res);
                return ;
            } else {
                ApiController.failed(500, 'document wasn\'t found', res);
                return ;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getShortHistory = async (req: Request, res: Response) => {
        try {
            const projectId = req.query.id;

            const history = await HistoryRepository.getList(projectId, 10);

            let histResp = await ProjectHistoryHelper.renderHistory(history);

            return ApiController.success({ history: histResp }, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static downloadHistory = async (req: Request, res: Response) => {
        try {
            const projectId = req.query.id;

            const history = await HistoryRepository.getList(projectId, 0);

            let renderedHistory = await ProjectHistoryHelper.renderHistory(history);

            // generate file with history
            let str = '';
            renderedHistory.forEach((v) => { 
                str = str + v.date + ' - ' + v.user + ' - ' + v.action + '\n'; 
            });

            const buffer = new Buffer(str);
            const publicTitle = projectId+'_history.txt';
            const contentType = mime.contentType(publicTitle);
            if (contentType) {
                const responseData = {
                        filename : publicTitle,
                        contentType: contentType,
                        doc: buffer.toString('base64')
                    };
                ApiController.success(responseData, res);
                return ;
            } else {
                ApiController.failed(500, 'document wasn\'t found', res);
                return ;
            }
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