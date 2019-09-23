import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class FaceReportActivity extends Model {
    public id!: number;
    public reportId!: number;
    public activityId!: number;
    public amountA!: number;
    public amountB!: number;
    public amountC!: number|null;
    public amountD!: number|null;
    public isRejected!: boolean;
    public rejectReason!: string|null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

FaceReportActivity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amountA: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: false
        },
        amountB: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: false
        },
        amountC: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: true,
            defaultValue: null
        },
        amountD: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: true,
            defaultValue: null
        },
        isRejected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        rejectReason: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'report_activities',
        modelName: 'faceReportActivity',
        timestamps: true,
        sequelize: sequelize
    }
)

export default FaceReportActivity;