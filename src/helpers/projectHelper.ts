import TmpFile from "../models/tmpFile";
import Project from "../models/project";
import ProjectDocument from "../models/projectDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";

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
        const usdBudget = projectData.ice / projectData.usdRate;
        projectData.type = usdBudget <= 50000 ? "SSFA" : "PCA";
        projectData.deadline = new Date(data.deadline);

        return projectData;
    }

    static transferProjectDocument = async (tmpId: number, documentTitle: string, project: Project) => {
        const tmpFile = await TmpFile.findByPk(tmpId);
        if (tmpFile) {
            const fileFoler = tmpFile.id.substring(0, 2);
            const fullPathToSave = ProjectDocument.documentsFolder + fileFoler;
            tmpFile.copyTo(fullPathToSave, tmpFile.getFullFilename());
            const projectDocument = await ProjectDocument.create({
                partnerId: project.id,
                userId: tmpFile.userId,
                title: documentTitle,
                filename: tmpFile.getFullFilename(),
                size: tmpFile.size,
                hash: null
            });
            tmpFile.deleteFile();
            return projectDocument;
        } else {
            throw new TmpFileNotFound();
        }
    }
}

export default ProjectHelper;