import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import htmlToText from 'html-to-text';
import { IUser } from '../models/userModel';


const transport = nodemailer.createTransport({
  // 500 mails a month to test
  //host: process.env.MAIL_HOST, 
  //port: Number(process.env.MAIL_PORT),
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS
  }
});

type Options = {
  user: IUser,
  subject: string,
  resetURL: string,
  filename: string
}

// TODO: change options to type Options
const generateHTML = (filename: string, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../../views/email/${filename}.pug`, options);
  const inlined = juice(html); // Inlines all the css so it's readable in most email clients, specially the old ones
  return inlined;
};

export const send = async (options: Options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html); // For all our sweet professors that reads their email in Emacs

  const mailOptions = {
    from: `sw707winejs@gmail.com`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };

  return transport.sendMail(mailOptions);
};