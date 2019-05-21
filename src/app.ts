import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import routes from "./routes";
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

        //Set all routes from routes folder
        this.app.use("/", routes);   
        
        // serving static files
        this.app.use(express.static('public'));
    }

    // private errorsHandling() {
    //     this.app.use(errorMiddleware);
    // }
}

export default new App().app;