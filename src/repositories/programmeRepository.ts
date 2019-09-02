import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class ProgrammeRepository {

    static getTree = async () => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        const query: string = 'WITH RECURSIVE tree (id, pid, code, title) as (SELECT programmes.id, programmes.pid, programmes.code, programmes."title' + lang + '" as title FROM programmes WHERE programmes.pid IS null UNION all SELECT c2.id, c2.pid, c2.code, c2."title' + lang + '" as title FROM programmes c2 INNER JOIN tree ON tree.id = c2.pid)SELECT * FROM tree';

        let programmesList: Array<Programme> | [] = await sequelize.query(query, {
            type: QueryTypes.SELECT,
            nest: true
        })

        if (programmesList.length > 0) {
            return ProgrammeRepository.makeTree(programmesList);
        }
        return [];
    }

    static makeTree = (programmesList: Array<Programme>) => {
        const chain: Array<number|null> | [] = [];
        const programmesTree: Array<Programme>|{} = programmesList.reduce(function (tree: Array<Programme>|{}, programme: Programme) {
            const parentId = programme.pid;
            programme.hasChildren = false;
            chain[programme.id] = parentId;
            // Get chain array
            let chainArray: Array<number>|[] = [];
            let key: number = programme.id;
            while (chain[key] !== null) {
                key = (chainArray.length>0 && chainArray.slice(-1).pop())?chainArray.slice(-1).pop():programme.id;
                if (typeof chain[key] == 'number') {
                    chainArray.push(chain[key]);
                }
            }

            // set programme in a tree place
            if (chainArray.length == 0) {
                tree[programme.id] = programme;
            } else {
                // get parrent programme object
                let parProgramme: Programme|null = null;
                chainArray.reverse().forEach((pid) => {
                    if (parProgramme == null) {
                        parProgramme = tree[pid];
                    } else {
                        parProgramme = parProgramme['children'][pid]
                    }
                })
                parProgramme.hasChildren = true;
                if (parProgramme['children']) {
                    parProgramme['children'][programme.id] = programme;
                } else {
                    parProgramme['children'] = {};
                    parProgramme['children'][programme.id] = programme;
                }
            }

            return tree;
        }, {});
        return programmesTree;
    }
}

interface Programme {
    id: number;
    pid: number | null;
    code: string;
    title: string;
    hasChildren?: boolean;
    children?: Array<Programme>;
}

export default ProgrammeRepository;