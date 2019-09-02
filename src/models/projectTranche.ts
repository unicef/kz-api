import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class ProjectTranche extends Model {

    static WAITING_STATUS_KEY = 'waiting';
    static IN_PROGRESS_STATUS_KEY = 'in progress';
    static DONE_STATUS_KEY = 'done';

    public id!: number;
    public projectId!: number;
    public num!: number;
    public status!: string;
    public from!: Date;
    public to!: Date;
    public amount!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProjectTranche.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        num: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ProjectTranche.WAITING_STATUS_KEY
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false
        },
        to: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: new DataTypes.NUMBER({ precision: 14, scale: 2 }),
            allowNull: false
        }
    },
    {
        tableName: 'project_tranches',
        modelName: 'projectTranche',
        timestamps: true,
        sequelize: sequelize
    }
)

export default ProjectTranche;