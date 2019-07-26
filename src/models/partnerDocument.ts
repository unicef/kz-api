import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"
import config from "../config/config";

class PartnerDocument extends Model {
    static documentsRoute = '/partner/document';
    public id!: number;
    public partnerId!: number;
    public userId!: number;
    public title!: string;
    public filename!: string;
    public size!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    get href() {
        return config.APP_PROTOCOL + config.APP_NAME + PartnerDocument.documentsRoute + '?id=' + this.id;
    }

    public getFilePath = () => {
        const fileFoler = this.filename.substring(0, 2);

        return 'assets/partners/documents/' + fileFoler + '/' + this.filename;
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

PartnerDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        tableName: 'partner_documents',
        modelName: 'partnerDocument',
        timestamps: true,
        sequelize: sequelize
    }
)

export default PartnerDocument;