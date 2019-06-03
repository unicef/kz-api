exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('stringMaxValidation', 'Параметр {{label}} может состоять максимум из {{limit}} символов', 'The {{label}} parameter can consist of a maximum of {{limit}} characters')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('userNotAdmin', 'Доступ запрещен. Недостаточно прав', 'Access is denied. Not enough permissions')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('successSavingPhrase', 'Перевод успешно сохранен', 'Phrase successfuly saved')");
    
};

exports.down = (pgm) => {

};
