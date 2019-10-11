import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class ProjectActivity extends Model {
    public id!: number;
    public projectId!: number;
    public title!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProjectActivity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'project_activities',
        modelName: 'projectActivity',
        timestamps: true,
        sequelize: sequelize
    }
)

export default ProjectActivity;