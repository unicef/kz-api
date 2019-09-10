import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class FaceRequestActivity extends Model {
    public id!: number;
    public requestId!: number;
    public activityId!: number;
    public amountE!: number;
    public amountF!: number|null;
    public amountG!: number|null;
    public isRejected!: boolean;
    public rejectReason!: string|null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

FaceRequestActivity.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        activityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amountE: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: false
        },
        amountF: {
            type: new DataTypes.FLOAT({precision: 14, scale: 2}),
            allowNull: true,
            defaultValue: null
        },
        amountG: {
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
        tableName: 'request_activities',
        modelName: 'faceRequestActivity',
        timestamps: true,
        sequelize: sequelize
    }
)

export default FaceRequestActivity;