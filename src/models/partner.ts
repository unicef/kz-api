import { Model, DataTypes, QueryTypes, Sequelize } from "sequelize";
import sequelize from "../services/sequelize";
import Role from "./role";
import Country from "./country";
import AreaOfWork from "./areaOfWork";
import CompanyOwnership from "./companyOwnership";
import PartnerType from "./partnerType";
import CSOType from "./csoType";
import ProjectRepository from "../repositories/projectRepository";

class Partner extends Model {
    static PROJECTS_LIMIT = 1; // value 0 is unlimit of projects

    static partnerStatusNew = 'new';
    static partnerStatusFilled = 'filled';
    static partnerStatusApproved = 'trusted';
    static partnerStatusRejected = 'rejected';
    static partnerStatusBlocked = 'blocked';

    public id!: number;
    public statusId!: string;
    public assistId!: number|null;
    public authorisedId!: number|null;
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

    async getAssistId() {
        const assistantIds: Array<{id: number}>|null = await sequelize.query('SELECT users."id" FROM users LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN partners p ON p.id = users."partnerId" WHERE uhr."roleId" = \'' + Role.partnerAssistId + '\' AND users."partnerId" = ' + this.id + ' LIMIT 1', 
        {type: QueryTypes.SELECT});

        if (assistantIds.length > 0) {
            // get assistant
            let assistantId = assistantIds.map(a => a.id);

            this.assistId = assistantId[0];
        } else {
            this.assistId = null;
        }

    }

    async getAuthorisedId() {
        const authorisedIds: Array<{id: number}>|null = await sequelize.query('SELECT users."id" FROM users LEFT JOIN users_has_roles uhr ON users."id" = uhr."userId" LEFT JOIN partners p ON p.id = users."partnerId" WHERE uhr."roleId" = \'' + Role.partnerAuthorisedId + '\' AND users."partnerId" = ' + this.id + ' LIMIT 1', 
        {type: QueryTypes.SELECT});

        if (authorisedIds.length > 0) {
            // get assistant
            let authorisedId = authorisedIds.map(a => a.id);

            this.authorisedId = authorisedId[0];
        } else {
            this.authorisedId = null;
        }
    }

    public getProjects = async () => {
        const projects = await ProjectRepository.findByPartnerId(this.id);

        return projects;
    }
}

Partner.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        assistId: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            defaultValue: null
        },
        authorisedId: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            defaultValue: null
        },
        statusId: {
            type: new DataTypes.STRING(20),
            allowNull: false,
            defaultValue: Partner.partnerStatusNew
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