import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class TmpFile extends Model {
    public id!: string;
    public userId!: number;
    public originalName!: string;
    public mimeType!: string;
    public size!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

TmpFile.init(
    {
        id: {
            type: new DataTypes.STRING(1000),
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        originalName: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        mimeType: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'tmp_files',
        modelName: 'tmpFile',
        timestamps: true,
        sequelize: sequelize
    }
)

export default TmpFile;