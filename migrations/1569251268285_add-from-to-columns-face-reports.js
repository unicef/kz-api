exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("face_reports", {
        typeId: {
            type: "integer",
            notNull: true,
            default: 1
        },
        from: {
            type: "timestamp",
            notNull: true
        },
        to: {
            type: "timestamp",
            notNull: true
        }
    });
};

exports.down = (pgm) => {

};
