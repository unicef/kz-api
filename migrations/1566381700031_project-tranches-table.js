exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createType("project_tranche_status", ["waiting", "in progress", "done"]);
    pgm.createTable("project_tranches", {
        id: "id",
        projectId: { 
            type: "integer", 
            notNull: true,
            references: 'projects'
        },
        num: {
            type: "integer",
            notNull: true,
        },
        status: {
            type: "project_tranche_status",
            notNull: true,
            default: "waiting"
        },
        from: {
            type: "timestamp",
            notNull: true
        },
        to: {
            type: "timestamp",
            notNull: true
        },
        amount: {
            type: "numeric(14,2)", 
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
