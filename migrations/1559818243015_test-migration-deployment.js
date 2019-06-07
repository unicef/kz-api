exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql('INSERT INTO public.partner_types (title) values (\'21314\')');
};

exports.down = (pgm) => {

};
