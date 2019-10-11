exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("report_activities", {
        id: "id",
        reportId: { 
            type: "integer", 
            notNull: true,
            references: "face_reports"
        },
        activityId: {
            type: "integer", 
            notNull: true,
            references: "project_activities"
        },
        amountA: {
            type: "numeric(14,2)",
            notNull: true
        },
        amountB: {
            type: "numeric(14,2)",
            notNull: false,
            default: null
        },
        amountC: {
            type: "numeric(14,2)",
            notNull: false,
            default: null
        },
        amountD: {
            type: "numeric(14,2)",
            notNull: false,
            default: null
        },
        isRejected: {
            type: "boolean",
            notNull: true,
            default: false
        },
        rejectReason: {
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
};

exports.down = (pgm) => {
    pgm.dropTable("report_activities", {});
};
