// send email whit sendgrid

const sgMail = require('@sendgrid/mail');
const { config } = require('../../config/config');

sgMail.setApiKey(config.sendGridApiKey);

const sendEmail = async (email, subject, text) => {
  const msg = {
    to: email,
    from: config.emailFrom,
    subject: subject,
    text: text,
    html: text,
  };
  try {
    await sgMail.send(msg);
    console.log("🚀 ~ sendEmail ~ 'Email sent':", 'Email sent');
  } catch (error) {
    console.error(error);
  }
};

const sendEmailWithTemplate = async (
  email,
  subject,
  text,
  templateId,
  dynamicTemplateData
) => {
  const msg = {
    to: email,
    from: config.emailFrom,
    subject: subject,
    text: text,
    html: text,
    templateId: templateId,
    dynamicTemplateData: dynamicTemplateData,
  };
  try {
    await sgMail.send(msg);
    console.log("🚀 ~ 'sendEmailWithTemplate':", 'Email sent');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmail, sendEmailWithTemplate };
