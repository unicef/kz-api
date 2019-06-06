exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql('INSERT INTO public.partner_types (title) VALUES("test_deploy_migration")');
};

exports.down = (pgm) => {

};
