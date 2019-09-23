exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("projects_transactions", {
        id: "id",
        projectId: {
            type: "integer", 
            notNull: true,
            references: "projects",
            onDelete: 'CASCADE'
        },
        trancheId: {
            type: "integer", 
            notNull: true,
            references: "project_tranches",
            onDelete: 'CASCADE'
        },
        requestId: { 
            type: "integer", 
            notNull: true,
            references: "face_requests",
            onDelete: 'CASCADE'
        },
        transactionHash: {
            type: "varchar(255)",
            notNull: true
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("projects_transactions", {});
};
