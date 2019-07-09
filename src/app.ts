import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import i18next from "i18next";
import bodyParser from "body-parser";
import { init as SentryInit, Handlers as SentryHandlers } from "@sentry/node";
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
        SentryInit({ dsn: 'http://cb9e31b65cc84f298c7b1e15c01d6e4a@sentry.iskytest.com:8082/2', logLevel: 1});
        this.app.use(SentryHandlers.requestHandler());

        this.app.use(helmet());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended:false }));
        this.localInitialization();

        //Set all routes from routes folder
        this.app.use("/", routes);
        this.app.use(SentryHandlers.errorHandler());
        
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