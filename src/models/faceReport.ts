import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"
import User from "./user";
import Role from "./role";
import ProjectRepository from "../repositories/projectRepository";
import ProjectTranche from "./projectTranche";
import FaceRequestHelper from "../helpers/faceRequestHelper";

class FaceReport extends Model {
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
    public projectId!: number;
    public partnerId!: number;
    public from!: Date;
    public to!: Date;
    public statusId!: string;
    public typeId!: number;
    public isCertify!: boolean;
    public isValid!: boolean;
    public isAuthorised!: boolean;
    public approvedAt!: Date|null;
    public successedAt!: Date|null;
    public analyticalDocId!: number;
    public financialDocId!: number;
    public justificationDocId!: number|null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    async getProjectId() {
        if (this.projectId) {
            return this.projectId;
        } else {
            this.projectId = await ProjectRepository.getProjectIdByReportId(this.id);
            return this.projectId;
        }
    }

    async getPartnerId() {
        if (this.partnerId) {
            return this.partnerId;
        } else {
            this.partnerId = await ProjectRepository.getPartnerIdByTrancheId(this.trancheId);
            return this.partnerId;
        }
    }

    public getNum = async () => {
        const trancheNum = await ProjectTranche.findOne({
            where: {
                id: this.trancheId
            },
            attributes: ['num']
        });

        if (trancheNum) {
            return trancheNum.num;
        } else {
            return null;
        }
    }

    public async isMyStage (user: User) {
        await this.getPartnerId();
        return await FaceRequestHelper.isMyStage(this, user);
    }

    public reject = async () => {
        this.statusId = FaceReport.REJECT_STATUS_KEY;
        this.isCertify = false;
        this.isValid = false;
        this.approvedAt = null;
        return await this.save();
    }
}

FaceReport.init(
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
        projectId: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            defaultValue: null
        },
        partnerId: {
            type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ['trancheId']),
            allowNull: true,
            defaultValue: null
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
            defaultValue: FaceReport.CONFIRM_STATUS_KEY
        },
        typeId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 1
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
        },
        analyticalDocId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        financialDocId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        justificationDocId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'face_reports',
        modelName: 'faceReport',
        timestamps: true,
        sequelize: sequelize
    }
)

export default FaceReport;