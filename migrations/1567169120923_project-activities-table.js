exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("project_activities", {
        id: "id",
        projectId: { 
            type: "integer", 
            notNull: true,
            references: 'projects'
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
    pgm.dropTable("project_activities", {});
};
