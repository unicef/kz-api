import nodemailer from "nodemailer";
import Config from "../services/config";

const mailHost: string = Config.get("EMAIL_HOST", "localhost");
const mailPort: number = Config.get("EMAIL_PORT", 465);
const mailUser: string = Config.get("EMAIL_USER", '');
const mailPassword: string = Config.get("EMAIL_PASSWORD", '');

/**
 * Connect to PostgreSQL database
 */
const mailer = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailUser, // generated ethereal user
      pass: mailPassword // generated ethereal password
    }
  });


export default mailer;