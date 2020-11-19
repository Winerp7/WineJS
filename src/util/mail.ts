import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import htmlToText from 'html-to-text';
import { IUser } from '../models/userModel';


const transport = nodemailer.createTransport({
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
  filename: string;
};

// Render the HTML from password-reset.pug *into* the email that is being sent
const generateHTML = (filename: string, options: Options) => {
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