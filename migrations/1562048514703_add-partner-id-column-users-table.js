exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("users", {
        partnerId: { 
            type: "integer",
            notNull: false,
            default: null
        }
    });

    pgm.dropColumns("partners", ["assistId", "authorisedId"], {ifExists : true})

    pgm.sql('UPDATE public.users SET "partnerId" = 1 WHERE id = 12');
    pgm.sql('UPDATE public.users SET "partnerId" = 1 WHERE id = 13');
};

exports.down = (pgm) => {

};
