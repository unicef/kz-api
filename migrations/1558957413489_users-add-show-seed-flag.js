exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("users", {
        showSeed: { 
            type: "boolean",
            default: true,
            
        }
    });
};

exports.down = (pgm) => {

};
