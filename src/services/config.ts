
import config_dev from "../config/config_development";
import config_test from "../config/config_test";
import config_prod from "../config/config_production";

class Config {
    private env: string;

    private confObj: any;
    constructor () {
        this.env = process.env.NODE_ENV||"dev";
        switch (this.env) {
            case 'dev':
                this.confObj = config_dev;
                break;
            case 'test':
                this.confObj = config_test;
                break;
            case 'prod':
                this.confObj = config_prod;
                break;
            default:
                this.confObj = config_dev;
                break;
        }
    }

    public get (key: string, def: number|string|Array<any>|object) {
        // env first
        if (process.env[key]) {
            return process.env[key];
        } else if (this.confObj[key]) {
            // get from cofig folder
            return this.confObj[key];
        } else {
            // set default
            return def;
        }
    }
}

export default new Config();