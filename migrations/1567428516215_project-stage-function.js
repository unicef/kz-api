exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createFunction('get_project_stage_type', [
        { mode: 'IN', name: 'project', type: 'integer', default: null }
    ], {
        returns: 'TABLE("projectId" int, "projectType" text)',
        language: 'plpgsql',
        replace: true
    }, `declare
        status   character varying(255);
    begin
        SELECT projects."statusId" into status from projects where projects."id" = project;

        IF status = 'In progress' 
        THEN 
        return query SELECT project as "projectId", CASE WHEN pfrep."id" IS NULL AND (pfreq."id" IS NULL OR pfreq."statusId"!='success') THEN 'request' ELSE 'report' END as "projectType" FROM "project_tranches" pt LEFT JOIN "face_requests" pfreq ON pfreq."trancheId"=pt."id" LEFT JOIN face_reports pfrep ON pfrep."trancheId"=pt."id" WHERE pt."projectId" = project AND pt."status" = 'in progress' LIMIT 1;
        ELSE
        return query SELECT 0 as "projectId", CAST('' as text) as "projectType";
        END IF;
    END;
    `);
};

exports.down = (pgm) => {
    pgm.dropFunction('get_project_stage_type', [
        { mode: 'IN', name: 'PROJECT', type: 'integer', default: null }
      ],{
        ifExists : true,
        cascade : false
    });
};
