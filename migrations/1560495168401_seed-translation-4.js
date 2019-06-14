exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('partnerNotFindError', 'Партнер не найден', 'Partner not found')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('documentNotFindError', 'Документ не найден', 'Document not found')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('badPermissionsError', 'Недостаточно прав', 'Bad permissions')");
    
};

exports.down = (pgm) => {

};
