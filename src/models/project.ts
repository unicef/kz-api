import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Sequelize from "sequelize";
import event from "../services/event";
import ProjectWasUpdated from "../events/projectWasUpdated";
import ProjectTranche from "./projectTranche";

class Project extends Model {
    static DEFAULT_STATUS: string = 'Created';
    static CREATED_STATUS_ID: string = 'Created';
    static IN_PROGRESS_STATUS_ID: string = 'In progress';
    static COMPLETED_STATUS_ID: string = 'Completed';
    static TERMINATION_STATUS_ID: string = 'Project termination';

    static PROJECT_PCA_TYPE = 'PCA';
    static PROJECT_SSFA_TYPE = 'SSFA';

    public id!: number;
    public statusId!: string;
    public titleEn!: string;
    public titleRu!: string;
    public type!: string;
    public programmeId!: number;
    public deadline!: Date;
    public ice!: number;
    public usdRate!: number;
    public officerId!: number;
    public sectionId!: number;
    public partnerId!: number|null;
    public descriptionEn!: string;
    public descriptionRu!: string;
    public readonly createdAt!: Date; 
    public readonly updatedAt!: Date;

}

Project.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        statusId: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: Project.DEFAULT_STATUS
        },
        titleEn: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        titleRu: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        type: {
            type: new DataTypes.STRING(4),
            allowNull: false,
            defaultValue: ''
        },
        programmeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        ice: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: false
        },
        usdRate: {
            type: new DataTypes.NUMBER({precision: 14, scale: 2}),
            allowNull: false
        },
        officerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sectionId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        descriptionEn: {
            type: new DataTypes.TEXT(2500),
            allowNull: false,
            defaultValue: ''
        },
        descriptionRu: {
            type: new DataTypes.TEXT(2500),
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        tableName: 'projects',
        modelName: 'project',
        timestamps: true,
        sequelize: sequelize
    }
)

Project.belongsToMany(ProjectTranche, {
    through: ProjectTranche,
    otherKey: 'projectId'
});

export default Project;