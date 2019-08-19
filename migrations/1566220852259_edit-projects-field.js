exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql('ALTER TABLE public.projects ALTER COLUMN ice TYPE numeric(14,2) USING ice::numeric');
    pgm.sql('ALTER TABLE public.projects ALTER COLUMN "usdRate" TYPE numeric(14,2) USING "usdRate"::numeric');
};

exports.down = (pgm) => {

};
