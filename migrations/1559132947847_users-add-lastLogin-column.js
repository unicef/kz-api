exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("users", {
        lastLogin: { 
            type: "timestamp",
            notNull: false,
            default: null
        }
    });
};

exports.down = (pgm) => {

};
