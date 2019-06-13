exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('fileMimeValidation', 'Неверный формат файла', 'Bad file format')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('fileSizeValidation', 'Слишком большой файл', 'File size is too large')");
    
};

exports.down = (pgm) => {

};
