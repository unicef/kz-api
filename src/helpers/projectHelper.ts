import TmpFile from "../models/tmpFile";
import Project from "../models/project";
import ProjectDocument from "../models/projectDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";
import BadValidationException from "../exceptions/badValidationException";
import i18n from "i18next";
import ProjectTranche from "../models/projectTranche";
import ProjectDocumentsUploaded from "../events/projectDocumentsUploaded";
import event from "../services/event";

class ProjectHelper {

    static projectFields = [
        "titleEn",
        "titleRu",
        "ice",
        "usdRate",
        "descriptionEn",
        "descriptionRu"
    ];

    static projectSelectFields = [
        "programme",
        "officer",
        "section"
    ];

    static terminationReasons = [
        {
            key: `mouf`,
            en: `Mismanagement of UNICEF funds`,
            ru: `Нецелевое расходование денежных средств ЮНИСЕФ`
        }, 
        {
            key: `tfm`,
            en: `The force majeure`,
            ru: `Форс мажор`
        },
        {
            key: `pawn`,
            en: `The planned activities were not effective in producing the desired result`,
            ru: `Запланированные активности не привели к желаемому  результату`
        },
        {
            key: `aahs`,
            en: `Assurance activities have shown the inadequate use of funds`,
            ru: `Проведенные мероприятия по обеспечению качества показали нерациональное расходование средств`
        },
        {
            key: `oo`,
            en: `Other option (please provide the signed justification from the authorized official)`,
            ru: `Другое (пожалуйста предоставьте письменное подтверждение за подписью уполномоченного лица)`
        }
    ];

    static getProjectData = (data: any) => {
        let projectData: any = {};

        ProjectHelper.projectFields.forEach((field: string) => {
            if ((data[field] && data[field] !== null) || data[field] == '') {
                projectData[field] = data[field];
            }
        })

        ProjectHelper.projectSelectFields.forEach((field) => {
            if (data[field] && data[field] !== null) {
                projectData[field + "Id"] = data[field]["id"];
            }
        })

        projectData.statusId = "Created";
        parseFloat(projectData.ice);
        parseFloat(projectData.usdRate);
        const usdBudget = projectData.ice / projectData.usdRate;
        projectData.type = usdBudget <= 50000 ? Project.PROJECT_SSFA_TYPE : Project.PROJECT_PCA_TYPE;
        projectData.deadline = new Date(data.deadline);

        return projectData;
    }

    static transferProjectDocument = async (tmpId: number, documentTitle: string, project: Project): Promise<ProjectDocument> => {
        const tmpFile = await TmpFile.findByPk(tmpId);
        if (tmpFile) {
            const fileFoler = tmpFile.id.substring(0, 2);
            const fullPathToSave = ProjectDocument.documentsFolder + fileFoler;
            tmpFile.copyTo(fullPathToSave, tmpFile.getFullFilename());
            const projectDocument = await ProjectDocument.create({
                projectId: project.id,
                userId: tmpFile.userId,
                title: documentTitle,
                filename: tmpFile.getFullFilename(),
                size: tmpFile.size,
                hash: null
            });
            event(new ProjectDocumentsUploaded(tmpFile.userId, project, projectDocument));

            tmpFile.deleteFile();
            return projectDocument;
        } else {
            throw new TmpFileNotFound();
        }
    }

    static getTranchesData = async (project: Project, tranches: Array<iInputTranche>): Promise<Array<iInputTranche>> => {
        const currentTimestamp = Math.floor(new Date().getTime()/1000.0);
        const projectDeadlineTs = Math.floor(project.deadline.getTime()/1000.0);
        const projectICE = parseFloat(project.ice);
        let tranchesAmount: number = 0;
        tranches.map((tranche, index) => {
            tranche.from = new Date(tranche.from);
            const dateFromTs = Math.floor(tranche.from.getTime()/1000.0);
            tranche.to = new Date(tranche.to);
            const dateToTs = Math.floor(tranche.to.getTime()/1000.0);
            const amount = tranche.amount;
            if (dateFromTs >= dateToTs) {
                throw new BadValidationException(400, 129, i18n.t('badTrancheDates'), `Date of ending tranche should not be less than date of tranche starting`);
            }
            switch (index) {
                case 0:
                    if (currentTimestamp-86400 > dateFromTs) {
                        throw new BadValidationException(400, 129, i18n.t('badTrancheFromDate'), `Date of first tranche should not be more than today`);
                    }
                    tranche.status = ProjectTranche.IN_PROGRESS_STATUS_KEY;
                    break;
                case tranches.length-1:
                    if (dateToTs > projectDeadlineTs) {
                        throw new BadValidationException(400, 129, i18n.t('badTrancheToDate'), `Date of ending last tranche should not be more than project deadline`);
                    }
                    tranche.status = ProjectTranche.WAITING_STATUS_KEY;
                    break;
                default: 
                    tranche.status = ProjectTranche.WAITING_STATUS_KEY;
                    break;
            }
            tranche.projectId = project.id;
            tranchesAmount = tranchesAmount + tranche.amount;
            tranche.num = index + 1;
            return tranche;
        })
        if (tranchesAmount != projectICE) {
            throw new BadValidationException(400, 129, i18n.t('badTranchesAmount'), `Total tranches amount should not be more than project ICE`);
        }

        return tranches;
    }

    static validateDocumentsData = async (project: Project, documents: Array<iInputDocs>): Promise<boolean>=> {
        const typeDocName = (project.type==Project.PROJECT_SSFA_TYPE)?ProjectDocument.SSFA_REQUIRED_DOC_TITLE:ProjectDocument.PCA_REQUIRED_DOC_TITLE;
        let requiredDocs: Array<string> = ProjectDocument.IN_PROGRESS_REQUIRED_DOCS;
        requiredDocs.push(typeDocName);
        console.log("REQUIRED DOCS", requiredDocs);
        documents.forEach((doc) => {
            const docIndex = requiredDocs.indexOf(doc.title);
            console.log("DOC INDEX", docIndex);
            if (docIndex >= 0) {
                requiredDocs.splice(docIndex, 1);
            }
        })
        console.log("REQUIRED DOCS AFFTERRRRR", requiredDocs);
        if (requiredDocs.length>0) {
            throw new BadValidationException(400, 155, i18n.t('requiredDocsError'), `Missing some required docs: ${requiredDocs.join('/')}`);
        }
        return true;
    }

    static getTerminationReasonTitle = (key: string): string|null => {
        const LANG = i18n.language;
        let title: string|null = null;

        ProjectHelper.terminationReasons.forEach((reason) => {
            if (reason.key == key) {
                title = reason[LANG]
            }
        })

        return title;
    }
}

interface iInputTranche {
    from: string|Date;
    to: string|Date;
    amount: number;
    num?: number;
    status?: string;
    projectId?: number;
}

interface iInputDocs {
    title: string;
    id: string;
}

export default ProjectHelper;