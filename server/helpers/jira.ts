import * as cryptoJs from 'crypto-js';
import * as fs from 'fs';
import * as Rp from 'request-promise';

import IContactus from '../api/contact-us/contactUs.interface';
import { IHeaders, IHeadersForUpload } from './interfaces';
import utils from './utils';
import config from '../config/config';

class Jira {
  private static instance: Jira;
  private constructor() {
    this.setHeaders();
  }
  private headers: IHeaders;
  public create = async (data: IContactus): Promise<string> => {
    const options: any = {
      url: config.jira_rest_api,
      method: 'POST',
      headers: this.headers,
      json: {
        fields: {
          project: { key: config.project },
          summary: `UXPL: ${data.area} Feedback`,
          versions: [{ name: config.version_name }],
          customfield_10000: { name: config.reporter_name },
          customfield_10024: { value: config.priority_value },
          description: `${data.comment} - as per feedback submitted by  ${data.email}`,
          issuetype: { name: config.issue_type },
          labels: config.labels,
        },
      },
    };
    const response: any = await Rp(options);
    if (!response.key) {
      throw new Error('There is no JIRA key in the response');
    }
    return response.key;
  };
  public uploadFiles = async (id: string, files: string[]): Promise<any> => {
    const attachments: Array<any> = [];
    for (const file of files) {
      attachments.push(fs.createReadStream(file));
    }
    const data: { file: Array<any> } = {
      file: attachments,
    };
    const headers: IHeadersForUpload = {
      ...this.headers,
      'Content-Type': 'multipart/form-data',
      'X-Atlassian-Token': 'nocheck',
    };
    const options: any = {
      url: `${config.jira_rest_api}${id}/attachments`,
      method: 'POST',
      headers: headers,
      formData: data,
    };
    return await Rp(options);
  };
  private setHeaders = (): void => {
    const userName: string = utils.getEnvVariable('USER_NAME', true);
    const user: string = userName.split('@')[0];
    const enctyptedPswd: string = utils.getEnvVariable('PASSWORD', true);
    const descryptPaswd: cryptoJs.DecryptedMessage = cryptoJs.AES.decrypt(
      enctyptedPswd,
      user
    );
    const pswd: string = descryptPaswd.toString(cryptoJs.enc.Utf8);
    const base64Endcode = `${new Buffer(`${user}:${pswd}`).toString('base64')}`;
    const auth = `Basic ${base64Endcode}`;
    this.headers = {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: auth,
    };
  };
  public static getInstance = (): Jira => {
    if (!Jira.instance) {
      Jira.instance = new Jira();
    }
    return Jira.instance;
  };
}
export default Jira;
