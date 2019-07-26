exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("users_personal_data", {
        userId: { 
            type: "integer", 
            notNull: true,
            primaryKey: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        firstNameEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        firstNameRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        lastNameEn: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        lastNameRu: {
            type: "varchar(255)",
            notNull: false,
            default: null
        },
        occupationRu: {
            type: "varchar(512)",
            notNull: false,
            default: null
        },
        occupationEn: {
            type: "varchar(512)",
            notNull: false,
            default: null
        },
        tel: {
            type: "varchar(20)",
            notNull: false,
            default: null
        },
        mobile: {
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
    pgm.dropTable("users_personal_data", {});
};
