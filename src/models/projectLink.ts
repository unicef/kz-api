import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class ProjectLink extends Model {
    public id!: number;
    public projectId!: number;
    public userId!: number;
    public href!: string;
    public title!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProjectLink.init(
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
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        href: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'project_links',
        modelName: 'projectLink',
        timestamps: true,
        sequelize: sequelize
    }
)

export default ProjectLink;