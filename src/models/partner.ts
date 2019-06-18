import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Role from "./role";
import SHA1 from "crypto-js/sha256";
import cryptoRandomString from "crypto-random-string";
import ActivationHash from "./activationHash";
import config from "../config/config";
import UserPersonalData from "./userPersonalData";
import User from "./user";
import Country from "./country";
import AreaOfWork from "./areaOfWork";
import CompanyOwnership from "./companyOwnership";
import PartnerType from "./partnerType";
import CSOType from "./csoType";

class Partner extends Model {
    static partnerStatusNew = 'new';
    static partnerStatusFilled = 'filled';
    static partnerStatusApproved = 'approved';
    static partnerStatusRejected = 'rejected';
    static partnerStatusBlocked = 'blocked';

    public id!: number;
    public statusId!: string;
    public assistId!: number;
    public authorisedId!: number;
    public nameEn!: string;
    public nameRu!: string;
    public tradeNameEn!: string;
    public tradeNameRu!: string;
    public license!: string;
    public countryId!: number;
    public ceoFirstNameEn!: string;
    public ceoFirstNameRu!: string;
    public ceoLastNameEn!: string;
    public ceoLastNameRu!: string;
    public establishmentYear!: number;
    public employersCount!: number;
    public areaOfWorkId!: number;
    public ownershipId!: number;
    public partnerTypeId!: number;
    public csoTypeId!: number;
    public tel!: string;
    public website!: string;
    public cityEn!: string;
    public cityRu!: string;
    public addressEn!: string;
    public addressRu!: string;
    public zip!: string;
    public readonly createdAt!: Date; 
    public readonly updatedAt!: Date;

}

Partner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        statusId: {
            type: new DataTypes.STRING(20),
            allowNull: false,
            defaultValue: Partner.partnerStatusNew
        },
        assistId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        authorisedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        nameEn: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        nameRu: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        tradeNameEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        tradeNameRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        license: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        countryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        ceoFirstNameEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        ceoFirstNameRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        ceoLastNameEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        ceoLastNameRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        establishmentYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        employersCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        areaOfWorkId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        ownershipId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        partnerTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        csoTypeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        tel: {
            type: new DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        website: {
            type: new DataTypes.STRING(124),
            allowNull: true,
            defaultValue: null
        },
        cityEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        cityRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        addressEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        addressRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        zip: {
            type: new DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'partners',
        modelName: 'partner',
        timestamps: true,
        sequelize: sequelize
    }
)

Partner.belongsTo(User, {
    foreignKey: 'assistId',
    as: 'assistant'
});
Partner.belongsTo(User, {
    foreignKey: 'authorisedId',
    as: 'authorized'
});
Partner.belongsTo(Country, {
    foreignKey: 'countryId',
    as: 'country'
});
Partner.belongsTo(AreaOfWork, {
    foreignKey: 'areaOfWorkId',
    as: 'areaOfWork'
});
Partner.belongsTo(CompanyOwnership, {
    foreignKey: 'ownershipId',
    as: 'ownership'
});
Partner.belongsTo(PartnerType, {
    foreignKey: 'partnerTypeId',
    as: 'partnerType'
});
Partner.belongsTo(CSOType, {
    foreignKey: 'csoTypeId',
    as: 'csoType'
});

export default Partner;