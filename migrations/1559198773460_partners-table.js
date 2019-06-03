exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("partners", {
        id: "id",
        statusId: {
            type: "varchar(20)", 
            notNull: true,
            default: "new"
        },
        assistId: {
            type: "integer", 
            notNull: true,
            references: 'users'
        },
        authorisedId: {
            type: "integer", 
            notNull: false,
            references: 'users',
            onDelete: 'SET NULL',
            default: null
        },
        nameEn: {
            type: "varchar(255)",
            notNull: true
        },
        nameRu: {
            type: "varchar(255)",
            notNull: true
        },
        tradeNameEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        tradeNameRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        license: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        countryId: { 
            type: "integer", 
            notNull: false,
            references: 'countries',
            onDelete: 'SET NULL',
            default: null
        },
        seoFirstNameEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        seoFirstNameRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        seoLastNameEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        seoLastNameRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        establishmentYear: {
            type: "integer",
            notNull: false,
            default: null
        },
        employersCount: {
            type: "integer",
            notNull: false,
            default: null
        },
        areaOfWorkId: {
            type: "integer", 
            notNull: false,
            references: 'areas_of_work',
            onDelete: 'SET NULL',
            default: null
        },
        ownershipId: {
            type: "integer", 
            notNull: false,
            references: 'companys_ownerships',
            onDelete: 'SET NULL',
            default: null
        },
        partnerTypeId: {
            type: "integer", 
            notNull: false,
            references: 'partner_types',
            onDelete: 'SET NULL',
            default: null
        },
        csoTypeId: {
            type: "integer", 
            notNull: false,
            references: 'cso_types',
            onDelete: 'SET NULL',
            default: null
        },
        tel: {
            type: "varchar(20)",
            notNull: false,
            default: null
        },
        website: {
            type: "varchar(124)",
            notNull: false,
            default: null
        },
        cityEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        cityRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        addressEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        addressRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        zip: {
            type: "varchar(20)",
            notNull: false,
            default: null
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updatedAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable("partners", {});
};
