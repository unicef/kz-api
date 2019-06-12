import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import i18next from "i18next";
import bodyParser from "body-parser";
import routes from "./routes";
import config from "./config/config";
import Translation from './models/translation';

class App {
    public app: express.Application = express();

    constructor() {
        this.app.use( morgan( 'combined') );
        this.config();
    }

    private config(): void{
        // Call midlewares
        this.app.use(cors({
            optionsSuccessStatus:200
        }));
        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended:false }));
        this.localInitialization();

        //Set all routes from routes folder
        this.app.use("/", routes);
        
        // serving static files
        this.app.use(express.static('public'));
    }

    private async localInitialization () {
        const locales = config.locales;

        // set defaults translation values
        let resources: any = {};
        for (let key in locales) {
            resources[key] = {translation:{}};
            await Translation.findAll({
                attributes: ["key", key]
            }).then(translations => {
                translations.forEach(function(translation: any) {
                    resources[key]['translation'][translation.key] = translation[key];
                })
            });
        }
        i18next.init({
            lng: 'en',
            resources: resources,
            preload: ['en', 'ru'],
            interpolation: {
                prefix: "!{I{",
                suffix: "}I}!"
            }
        });
    }
}

export default new App().app;