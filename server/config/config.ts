const config = {
  fileHome: './dist/files/',
  fromEmail: 'from@test.com',
  toEmail: 'to@test.com',
  jira_rest_api: 'https://jira.com/rest/api/2/issue/', // Provide your org jira link

  //jira payload params
  jira_link: 'https://jira.com/browse/', //// Provide your org jira link
  project: 'formUpload',
  version_name: 'v1.0.0',
  reporter_name: 'test',
  priority_value: '2-High',
  issue_type: 'Defect',
  labels: [''],
};
export default config;
