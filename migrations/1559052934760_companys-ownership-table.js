exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("companys_ownerships", {
        id: "id",
        title: { 
            type: "varchar(255)", 
            notNull: true
        }
    });

    pgm.sql("INSERT INTO public.companys_ownerships (title) VALUES ('Private owned'), ('State'), ('Non-commercial'), ('International organization')");
};

exports.down = (pgm) => {
    pgm.dropTable("companys_ownerships", {});
};
