exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("project_documents", {
        id: "id",
        projectId: { 
            type: "integer", 
            notNull: true,
            references: 'projects'
        },
        userId: { 
            type: "integer", 
            notNull: true
        },
        title: {
            type: "varchar(1000)", 
            notNull: true
        },
        filename: {
            type: "varchar(255)", 
            notNull: true
        },
        size: { 
            type: "integer",
            notNull: true
        },
        hash: {
            type: "varchar(255)",
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
        },
    })
};

exports.down = (pgm) => {
    pgm.dropTable("project_documents", {});
};
