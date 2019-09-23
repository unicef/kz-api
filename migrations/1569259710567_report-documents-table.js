exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("report_documents", {
        id: "id",
        userId: { 
            type: "integer", 
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
        }
    });

    pgm.addColumns("face_reports", {
        analyticalDocId: {
            type: "integer",
            notNull: true
        },
        financialDocId: {
            type: "integer",
            notNull: true
        },
        justificationDocId: {
            type: "integer",
            notNull: false,
            default: null
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("report_documents", {});
};