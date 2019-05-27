import HttpException from "./httpException";

class AuthRequiredException extends HttpException {
    /**
     * Http responce code
     */
    status: number;

    /**
     * Error message
     */
    message: string;

    /**
     * Message for developers (only on development env mode)
     */
    devMessage: string;

    /**
     * Create Bad validation exception
     * @param status 
     * @param message 
     */
    constructor(status: number, message: string, devMessage: string) {
        super(status, message, devMessage);
        this.status = status;
        this.message = message;
        this.devMessage = devMessage;
    }
}

export default AuthRequiredException;