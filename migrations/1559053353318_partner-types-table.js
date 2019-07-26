exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("partner_types", {
        id: "id",
        title: { 
            type: "varchar(255)", 
            notNull: true
        }
    });

    pgm.sql("INSERT INTO public.partner_types (title) VALUES ('Bilateral/multilateral'), ('Civil society'), ('Government'), ('UN Agency')");
};

exports.down = (pgm) => {
    pgm.dropTable("partner_types", {});
};
