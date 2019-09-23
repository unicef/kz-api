import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"
import Config from "../services/config";

class FaceReportDocument extends Model {
    static readonly documentsRoute = '/report/document';
    static readonly documentsFolder = __dirname + '/../../assets/reports/documents/';
    public id!: number;
    public userId!: number;
    public title!: string;
    public filename!: string;
    public size!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    get href() {
        const protocol = Config.get("APP_PROTOCOL", 'http://');
        const appName = Config.get("APP_NAME", 'api.local.com');
        return protocol + appName + FaceReportDocument.documentsRoute + '?id=' + this.id;
    }

    public getFilePath = () => {
        const fileFoler = this.filename.substring(0, 2);

        return 'assets/reports/documents/' + fileFoler + '/' + this.filename;
    }

    public getPublicFilename = () => {
        const fileName = this.title;

        return fileName + this.getFileExtention();
    }

    public getFileExtention = (): string|null => {
        const re = /(?:\.([^.]+))?$/;
        const extension = re.exec(this.filename);

        if (extension == null) {
            return null;
        } else if (extension instanceof Array) {
            return extension[0];
        } else {
            return extension;
        }
    }
}

FaceReportDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: new DataTypes.STRING(1000),
            allowNull: false
        },
        filename: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'report_documents',
        modelName: 'reportDocument',
        timestamps: true,
        sequelize: sequelize
    }
)

export default FaceReportDocument;