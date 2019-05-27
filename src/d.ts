declare module "*.json";
declare module '@hapi/joi';
declare module 'crypto-random-string';

declare namespace Express {
    export interface Request {
       user?: any
    }
}