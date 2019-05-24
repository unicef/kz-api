import nodemailer from "nodemailer";

const mailHost: string = process.env.EMAIL_HOST || 'localhost';
const mailPort: any = process.env.EMAIL_PORT || 465;
const mailUser: string = process.env.EMAIL_USER || '';
const mailPassword: string = process.env.EMAIL_PASSWORD || '';


/**
 * Connect to PostgreSQL database
 */
const mailer = nodemailer.createTransport({
    host: mailHost,
    port: parseInt(mailPort),
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailUser, // generated ethereal user
      pass: mailPassword // generated ethereal password
    }
  });


export default mailer;