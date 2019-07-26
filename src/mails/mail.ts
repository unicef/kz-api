import fs from "fs";
import ejs from "ejs";
import i18n from "i18next";
import mailer from "../services/mailer";

abstract class Mail {
    public abstract from?:string;
    public abstract to?:string;
    public abstract subject?:string;
    public abstract template?:string;
    public abstract mailData?:any;
    
    public async send() {
        const html = await ejs.renderFile(__dirname + '/../../mails/' + this.template + '_' + i18n.language + '.ejs', this.mailData);

        let mail = await mailer.sendMail({
            from: this.from, // sender address
            to: this.to, // list of receivers
            subject: this.subject, // Subject line
            html:  html// html body
          });
        
        console.log("Message sent: %s", mail.messageId);
    }
}

export default Mail;