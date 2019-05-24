exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("INSERT INTO public.roles (id, title) VALUES ('a', 'Administrator'),('d', 'Donor'), ('ro', 'Responsible officer'), ('bo', 'Budget owner'), ('dr', 'Deputy representative'), ('om', 'Operation manager'), ('ra', 'Responsible assistant'), ('ap', 'Authorised person')")
};

exports.down = (pgm) => {

};
