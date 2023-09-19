const nodemailer = require('nodemailer');
const fs = require('fs');

/**
 *
 * @param {object} option
 * @param {String} option.to
 * @param {String} option.from
 * @param {String} option.subject
 * @param {String} option.message
 * @param {String | null} option.sender `optional` - Example "Cyril cyril@cy.dev"
 * @param {String | null} option.user `optional`
 * @param {String | null} option.pass `optional`
 * @param {String | null} option.port `optional`
 * @param {String | null} option.host `optional`
 * @returns void
 */

const sendEmail = async (option) => {
  // Keys
  let user = option.user ? option.user : process.env.MAIL_USER;
  let pass = option.pass ? option.pass : process.env.MAIL_PASS;
  let port = option.port ? option.port : process.env.MAIL_PORT;
  let host = option.host ? option.host : process.env.MAIL_HOST;
  let sender = option.sender
    ? option.sender
    : `${process.env.MAIL_NAME} ${process.env.MAIL_NAME?.toLocaleLowerCase()}@${
        process.env.MAIL_DOMAIN
      }`;

  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true,
    auth: {
      user: user,
      pass: pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: sender,
    to: option.to,
    subject: option.subject,
    html: option.message
  };
  return transporter.sendMail(mailOptions, (error, data) => {
    if (data) {
      //TODO: implenment Proper Logging
      console.log('Mail Good');
      return;
    }
    if (error) {
      //TODO: implenment Proper Logging
      console.log(error);
      console.log('failed Mail');
      return;
    }
  });
};

module.exports = sendEmail;
