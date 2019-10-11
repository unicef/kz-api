import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class FaceRequestChain extends Model {
    public id!: number;
    public requestId!: number;
    public createdBy!: number;
    public createdAt!: Date;
    public confirmBy!: number;
    public confirmAt!: Date|null;
    public validateBy!: number;
    public validateAt!: Date|null;
    public certifyBy!: number|null;
    public certifyAt!: Date|null;
    public approveBy!: number|null;
    public approveAt!: Date|null;
    public verifyBy!: number|null;
    public verifyAt!: Date|null;

    public rejectRequest = async () => {
        this.verifyBy = null;
        this.approveAt = null;
        this.approveBy = null;
        this.certifyAt = null;
        this.certifyBy = null;
        this.validateAt = null;
        this.confirmAt = null;

        return await this.save();
    }
}

FaceRequestChain.init(
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
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        confirmBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        confirmAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        validateBy:  {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        validateAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        certifyBy:  {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        certifyAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        approveBy:  {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        approveAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        verifyBy:  {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        verifyAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'request_confirm_chains',
        modelName: 'faceRequestChain',
        timestamps: false,
        sequelize: sequelize
    }
)

export default FaceRequestChain;