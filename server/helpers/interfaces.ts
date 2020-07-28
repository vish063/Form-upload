interface IEmailOpts {
  from: string;
  to: string;
  subject: string;
  attachments: Array<{ filename: string; path: string }>;
  html: string;
}
interface IHeaders {
  'Content-Type': string;
  Authorization: string;
}
interface IHeadersForUpload extends IHeaders {
  'X-Atlassian-Token': string;
}
export { IEmailOpts, IHeaders, IHeadersForUpload };
