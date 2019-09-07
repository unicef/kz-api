import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class FaceRequest extends Model {
    static WAITING_STATUS_KEY = 'waiting';
    static CONFIRM_STATUS_KEY = 'confirm';
    static VALIDATE_STATUS_KEY = 'validate';
    static CERTIFY_STATUS_KEY = 'certify';
    static APPROVE_STATUS_KEY = 'approve';
    static VERIFY_STATUS_KEY = 'verify';
    static SUCCESS_STATUS_KEY = 'success';
    static REJECT_STATUS_KEY = 'reject';

    public id!: number;
    public trancheId!: number;
    public from!: Date;
    public to!: Date;
    public statusId!: string;
    public isCertify!: boolean;
    public isValid!: boolean;
    public isAuthorised!: boolean;
    public approvedAt!: Date;
    public successedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

FaceRequest.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        trancheId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false
        },
        to: {
            type: DataTypes.DATE,
            allowNull: false
        },
        statusId: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: FaceRequest.CONFIRM_STATUS_KEY
        },
        isCertify: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isAuthorised: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        successedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'face_requests',
        modelName: 'faceRequest',
        timestamps: true,
        sequelize: sequelize
    }
)

export default FaceRequest;