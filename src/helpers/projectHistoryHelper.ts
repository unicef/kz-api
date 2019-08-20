
class ProjectHistoryHelper {
    static EVENTS: Array<string> = [
        'create',
        'edit',
        'upload_docs',
        'set_ip',
        'set_tranches',
        'add_link'
    ];

    static CREATE_EVENT_KEY: string = 'create';
    static EDIT_EVENT_KEY: string = 'edit';
    static UPLOAD_DOCS_EVENT_KEY: string = 'upload_docs';
    static DELETE_DOC_EVENT_KEY: string = 'delete_doc';
    static SET_IP_EVENT_KEY: string = 'set_ip';
    static SET_TRANCHES_EVENT_KEY: string = 'set_tranches';
    static ADD_LINK_EVENT_KEY: string = 'add_link';

    
}

export default ProjectHistoryHelper;