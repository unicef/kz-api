exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("donors_companies", {
        userId: { 
            type: "integer", 
            notNull: true,
            primaryKey: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        companyEn: {
            type: "varchar(512)",
            notNull: true,
            default: null
        },
        companyRu: {
            type: "varchar(512)",
            notNull: true,
            default: null
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("donors_companies", {});
};
