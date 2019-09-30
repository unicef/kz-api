import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class ProjectTransaction extends Model {
    // transaction types
    static readonly INCOME_TYPE = `income`;
    static readonly OUTCOME_TYPE = `outcome`;

    // transaction statuses
    static readonly PENDING_STATUS = `pending`;
    static readonly SUCCESS_STATUS = `success`;
    static readonly FAILED_STATUS = `failed`;

    public id!: number;
    public projectId!: number;
    public txHash!: string;
    public amount!: number;
    public type!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProjectTransaction.init(
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
        txHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'project_trancactions',
        modelName: 'projectTransaction',
        timestamps: true,
        sequelize: sequelize
    }
)

export default ProjectTransaction;