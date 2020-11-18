import nodemailer from 'nodemailer';
import pug from 'pug';
import juice from 'juice';
import htmlToText from 'html-to-text';


const transport = nodemailer.createTransport({
  // 500 mails a month to test
  //host: process.env.MAIL_HOST, 
  //port: Number(process.env.MAIL_PORT), // Port has to be a number
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS
  }
});

// ? A test function to see if email gets sent
// transport.sendMail({
//   to: 'sejereje@email.com',
//   from: 'matti@test.com',
//   subject: "Just trying things out",
//   html: 'Hey I <strong>rock</strong> your world',
//   text: 'Hey you **rock**'
// });;

const generateHTML = (filename: any, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../../views/email/${filename}.pug`, options);
  const inlined = juice(html); // Inlines all the css so it's readable in most email clients, specially the old ones
  return inlined;
};

export const send = async (options: any) => {
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
  //const send = promisify(transport.sendMail.bind(transport));
};