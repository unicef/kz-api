import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import fs from "fs";

class TmpFile extends Model {
    static tmpFolder = __dirname + '/../../assets/tmp/';

    public id!: string;
    public userId!: number;
    public originalName!: string;
    public mimeType!: string;
    public size!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getFullFilename = (): string => {
        let fileName = this.id;
        const extension = this.getFileExtention();
        if (extension !== null) {
            fileName = fileName + extension;
        }
        return fileName;
    }

    public getFileExtention = (): string|null => {
        const fileName = this.originalName;
        const re = /(?:\.([^.]+))?$/;
        const extension = re.exec(fileName);

        if (extension == null) {
            return null;
        } else if (extension instanceof Array) {
            return extension[0];
        } else {
            return extension;
        }
    }

    private getFilePath = (): string => {
        return TmpFile.tmpFolder + this.id
    }

    public copyTo = (folderPath: string, fileName: string): void => {
        if (!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }
        fs.copyFileSync(this.getFilePath(), folderPath + '/' + fileName);
    }

    public deleteFile = async () => {
        fs.unlinkSync(this.getFilePath());

        return await this.destroy();
    }
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