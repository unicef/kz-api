exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.dropTable("projects_trancactions");
    pgm.createType("transaction_type", ["income", "outcome"]);
    pgm.createType("transaction_status", ["pending", "failed", "success"]);
    pgm.createTable("project_transactions", {
        id: "id",
        projectId: {
            type: "integer", 
            notNull: true,
            references: "projects"
        },
        txHash: {
            type: "varchar(255)",
            notNull: true
        },
        amount: {
            type: "numeric(14,2)",
            notNull: true,
            default: 0
        },
        type: {
            type: "transaction_type",
            notNull: true
        },
        status: {
            type: "transaction_status",
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
    pgm.dropTable("project_trancactions", {});
    pgm.dropType("transaction_type");
    pgm.dropType("transaction_status");
};
