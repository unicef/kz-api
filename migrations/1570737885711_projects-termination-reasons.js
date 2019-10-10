exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("projects_term_reasons", {
        projectId: { 
            type: "integer", 
            notNull: true,
            primaryKey: true,
            references: "projects",
            onDelete: 'CASCADE'
        },
        reasonId: {
            type: "varchar(20)",
            notNull: true
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("projects_term_reasons", {});
};
