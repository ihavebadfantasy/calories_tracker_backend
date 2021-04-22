const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs/promises');
const handlebars = require('handlebars');

class Mailer {
  static instance = null;

  static get $instance() {
    if (!Mailer.instance) {
      Mailer.instance = new Mailer();
    }

    return Mailer.instance;
  }

  clientUrl = process.env.CLIENT_URL;
  createPasswordUrl = '/create-password';
  newPasswordWasSetUrl = '/login';

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      },
    },
    {
      from: process.env.EMAIL_USERNAME,
    }
  );

  async sendNewPasswordWasSetEmail(req, user) {
    const template = await this.getEmailTemplate('resetPasswordSucceeded');

    try {
      return await this.transporter.sendMail({
        to: user.email,
        subject: req.t('email.subject.resetPasswordSucceeded'),
        html: template({
          name: user.username,
          link: `${this.clientUrl}${this.newPasswordWasSetUrl}`,
        }),
      });
    } catch (err) {
      console.warn(err);
    }
  }

  async sendResetPasswordEmail(req, user, token) {
    const template = await this.getEmailTemplate('requestResetPassword');

    try {
      return await this.transporter.sendMail({
        to: user.email,
        subject: req.t('email.subject.resetPassword'),
        html: template({
          name: user.username,
          link: `${this.clientUrl}${this.createPasswordUrl}?token=${token}&id=${user._id}`,
        }),
      });
    } catch (err) {
      console.warn(err);
    }
  }

  async getEmailTemplate(filename) {
    const sourcePath = path.resolve(__dirname, 'templates', `${filename}.handlebars`);
    const source = await fs.readFile(sourcePath, 'utf-8');

    return handlebars.compile(source);
  }
}

module.exports = Mailer;
