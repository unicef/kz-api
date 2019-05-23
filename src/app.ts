import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
import i18next from "i18next";
import config from "./config/config";
import Translation from './models/translation';
//import errorMiddleware from "./middlewares/errorMiddleware";
//import config from "./config";

class App {
    public app: express.Application = express();

    constructor() {
        this.app.use( morgan( 'combined') );
        this.config();
        //this.errorsHandling();
    }

    private config(): void{
        // Call midlewares
        this.app.use(cors());
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

    // private errorsHandling() {
    //     this.app.use(errorMiddleware);
    // }
}

export default new App().app;