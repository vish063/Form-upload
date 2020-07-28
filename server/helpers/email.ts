import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as cryptoJs from 'crypto-js';

import utils from './utils';
import config from '../config/config';
import IContactus from '../api/contact-us/contactUs.interface';
import { IEmailOpts } from './interfaces';
import * as Mail from 'nodemailer/lib/mailer';

class Email {
  public static send = async (
    jiraNumber: string,
    formData: IContactus,
    files: Array<string>
  ): Promise<any> => {
    const userName: string = utils.getEnvVariable('USER_NAME', true);
    const user: string = userName.split('@')[0];
    const enctyptedPswd: string = utils.getEnvVariable('PASSWORD', true);
    const descryptPaswd: cryptoJs.DecryptedMessage = cryptoJs.AES.decrypt(
      enctyptedPswd,
      user
    );
    const pswd: string = descryptPaswd.toString(cryptoJs.enc.Utf8);
    const transporter: Mail = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: userName,
        pass: pswd,
      },
    });
    const attachments: Array<{ filename: string; path: string }> = [];
    for (const file of files) {
      attachments.push({ filename: path.basename(file), path: file });
    }
    const submissionTemplate = `Hi Team,\n<p>The following user has submitted his/her feedback on ux.tibco.com. Please find the details below</p> <p>\nName -${formData.name}</p><p>Email - ${formData.email}</p><p>Area - ${formData.area}</p><p>Comment -${formData.comment}</p><p>JIRA <a href='${config.jira_link}${jiraNumber}'>${jiraNumber}</a>is created accordingly </p>`;

    const replyTemplate = `<p>Thank you for submitting your feedback. Someone from the UX team will contact you shortly. JIRA <a href='${config.jira_link}${jiraNumber}'>${jiraNumber}</a> has been raised with the following details:</p><p>\nName - ${formData.name}</p><p>Email - ${formData.email}<p>\nArea - ${formData.area}</p><p>\nComment - ${formData.comment}</p>`;
    const submissionOpts: IEmailOpts = {
      from: config.fromEmail,
      to: config.toEmail,
      subject: `${formData.area} request`,
      attachments: attachments,
      html: submissionTemplate,
    };
    const subMissionAck: Promise<any> = await transporter.sendMail(
      submissionOpts
    );
    const replyOpts: IEmailOpts = {
      from: config.fromEmail,
      to: formData.email,
      subject: `${formData.area} request`,
      attachments: attachments,
      html: replyTemplate,
    };
    const replyAck: Promise<any> = await transporter.sendMail(replyOpts);
    return {
      subMissionAck,
      replyAck,
    };
  };
}
export default Email;
