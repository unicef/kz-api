exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("request_activities", {
        id: "id",
        requestId: { 
            type: "integer", 
            notNull: true,
            references: "face_requests"
        },
        activityId: {
            type: "integer", 
            notNull: true,
            references: "project_activities"
        },
        amountE: {
            type: "numeric(14,2)",
            notNull: true
        },
        amountF: {
            type: "numeric(14,2)",
            notNull: false,
            default: null
        },
        amountG: {
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
    pgm.dropTable("request_activities", {});
};
