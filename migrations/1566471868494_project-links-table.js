exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("project_links", {
        id: "id",
        projectId: { 
            type: "integer", 
            notNull: true,
            references: 'projects'
        },
        userId: { 
            type: "integer", 
            notNull: true,
            references: 'users'
        },
        href: {
            type: "varchar(255)", 
            notNull: true
        },
        title: {
            type: "varchar(255)", 
            notNull: true
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
    });
};

exports.down = (pgm) => {
    pgm.dropTable("project_tranches", {});
    pgm.dropType("project_tranche_status");
};
