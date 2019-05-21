/**
 * Http Exception class
 */
class HttpException extends Error {
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
     * Create Http exception
     * @param status 
     * @param message 
     */
    constructor(status: number, message: string, devMessage: string) {
        super(message);
        this.status = status;
        this.message = message;
        this.devMessage = devMessage;
    }
}

export default HttpException;