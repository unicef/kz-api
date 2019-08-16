import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
import express from "express";
import i18next from "i18next";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { init as SentryInit, Handlers as SentryHandlers } from "@sentry/node";
import routes from "./routes";
import Config from "./services/config";
import Translation from './models/translation';
import User from "./models/user";

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
        SentryInit({ dsn: 'http://cb9e31b65cc84f298c7b1e15c01d6e4a@sentry.iskytest.com:8082/2', defaultIntegrations: false, logLevel: 1});
        this.app.use(SentryHandlers.requestHandler());

        this.app.use(helmet());
        Object.defineProperty(global, '_bitcore', { get(){ return undefined }, set(){} })
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended:false }));
        this.localInitialization();

        //Set all routes from routes folder
        this.app.use("/", this.getUser, routes);
        this.app.use(SentryHandlers.errorHandler());
        
        // serving static files
        this.app.use(express.static('public'));
    }

    private async localInitialization () {
        const locales = Config.get('locales', {"en" : {"code" : "en","title" : "English"}});

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

    private getUser = async (req: Request, res: Response, next: NextFunction) => {
        const jwtSecret: string = Config.get("JWT_SECRET", 'jwt_default');
        let token: string|boolean = req.headers['authorization'] || false;
    
        if (!token) {
            req.user = null;
            return next();
        }
        // get token scheme
        const headerParts = token.split(' ');
        if (headerParts.length > 1) {
            let scheme = headerParts[0];
            token = headerParts[1];
        }
        if (token) {
            const verify = await jwt.verify(token, jwtSecret, (err, decoded: any) => {
                if (err) {
                    req.user = null;
                    return next();
                } else {
                    let user =  User.findOne({
                        where: {
                            email: decoded.userEmail
                        },
                        include: [
                            User.associations.roles,
                            User.associations.personalData
                        ]
                    }).then((user) => {
                        req.user = user;
                        return next();
                    }).catch((error) => {
                        req.user = null;
                        return next();
                    });     
              }
            });
        } else {
            req.user = null;
            return next();
        }
    }
}

export default new App().app;