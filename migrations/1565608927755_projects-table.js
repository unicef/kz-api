exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createType("project_type", ["SSFA", "PCA"]);
    pgm.createType("project_status", ["Created", "In progress", "Completed", "Project termination"]);
    pgm.createTable("projects", {
        id: "id",
        statusId: {
            type: "project_status",
            default: "Created"
        },
        titleEn: { 
            type: "varchar(255)", 
            notNull: true
        },
        titleRu: { 
            type: "varchar(255)", 
            notNull: true
        },
        type: {
            type: "project_type",
            default: "SSFA"
        },
        programmeId: {
            type: "integer",
            notNull: true,
            references: 'programmes'
        },
        deadline: {
            type: "timestamp",
            notNull: true
        },
        ice: {
            type: "float(2)",
            notNull: true
        },
        usdRate: {
            type: "float(2)",
            notNull: true
        },
        officerId: {
            type: "integer", 
            notNull: true,
            references: 'users'
        },
        sectionId: {
            type: "integer", 
            notNull: true,
            references: 'sections'
        },
        partnerId: {
            type: "integer", 
            notNull: false,
            references: 'partners'
        },
        descriptionEn: { 
            type: "text", 
            notNull: true
        },
        descriptionRu: { 
            type: "text", 
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
    pgm.createIndex("projects", ["id", "type"]);
};

exports.down = (pgm) => {
    pgm.dropTable("projects", {});
    pgm.dropType("project_type");
    pgm.dropType("project_status");
};
