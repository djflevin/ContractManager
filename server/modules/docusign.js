
//npm i -s docusign-esign@5.8.1

const docusign = require("docusign-esign");
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const PizZip = require("pizzip");
const path = require('path');

const sendEnvelopeFromTemplate = async (args, contracttype) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  const accountId = args.accountId;

  //Step 1. Make the envelope request body
  let envelope;

  if (contracttype === 1) {
    envelope = makeEnvelopeFramework(args);

  } else if (contracttype === 2) {
    envelope = makeEnvelopeSLetter(args);

  } else {
    if (args.templateId == 'docx') {
      envelope = makeEnvelopePDescriptionDocx(args);
    }
    else {
      envelope = makeEnvelopePDescription(args);
    }
  }

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  let results = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition: envelope,
  });

  return results;
};


function makeEnvelopeFramework(args) {

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = args.templateId;
  env.emailSubject = 'Please Sign Project Framework Agreement';

  let DateTab = docusign.Text.constructFromObject({
    tabLabel: 'Date', value: args.Date
  });

  let CompanyTab = docusign.Text.constructFromObject({
    tabLabel: 'Company', value: args.Company
  });

  let CompanyJurisTab = docusign.Text.constructFromObject({
    tabLabel: 'CompanyJurisdiction', value: args.CompanyRegister
  });

  let UCLTitleTab = docusign.Title.constructFromObject({
    tabLabel: 'UCLTitle', value: args.UCLTitle
  });

  let tabs = docusign.Tabs.constructFromObject({
    textTabs: [DateTab, CompanyTab, CompanyJurisTab],
    titleTabs: [UCLTitleTab],
  });

  let CompanyTitleTab = docusign.Title.constructFromObject({
    tabLabel: 'CompanyTitle', value: args.OrgTitle
  });

  let tabs2 = docusign.Tabs.constructFromObject({
    titleTabs: [CompanyTitleTab],
  });

  // Create template role elements to connect UCL and the Company
  // to the template
  // We're setting the parameters via the object creation
  let Company = docusign.TemplateRole.constructFromObject({
    email: args.CompanyEmail,
    name: args.CompanyName,
    roleName: "Company",
    tabs: tabs2,
  });

  // We're setting the parameters via setters
  let UCL = docusign.TemplateRole.constructFromObject({
    email: args.UCLEmail,
    name: args.UCLName,
    roleName: "UCL",
    tabs: tabs,
  });


  // Add the TemplateRole objects to the envelope object
  env.templateRoles = [Company, UCL];
  env.status = args.status; // We want the envelope to be sent

  return env;

}

function makeEnvelopeSLetter(args) {

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = args.templateId;
  env.emailSubject = 'Please Sign Project Student Letter';

  let UniReferenceTab = docusign.Text.constructFromObject({
    tabLabel: 'UniReference', value: args.StudentReference
  });

  let ModuleTab = docusign.Text.constructFromObject({
    tabLabel: 'Module', value: args.Module
  });

  let CompanyTab = docusign.Text.constructFromObject({
    tabLabel: 'Company', value: args.Company
  });


  let tabs = docusign.Tabs.constructFromObject({
    textTabs: [UniReferenceTab, ModuleTab, CompanyTab],
  });


  // Create template role elements to connect UCL and the Company
  // to the template
  // We're setting the parameters via the object creation
  let Student = docusign.TemplateRole.constructFromObject({
    email: args.StudentEmail,
    name: args.StudentName,
    roleName: "Student",
  });

  // We're setting the parameters via setters
  let UCL = docusign.TemplateRole.constructFromObject({
    email: args.UCLEmail,
    name: args.UCLName,
    roleName: "UCL",
    tabs: tabs,
  });


  // Add the TemplateRole objects to the envelope object
  env.templateRoles = [Student, UCL];
  env.status = args.status; // We want the envelope to be sent

  return env;

}

function makeEnvelopePDescription(args) {

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = args.templateId;
  env.emailSubject = 'Please Sign Project Terms';

  let CompanyJurisTab = docusign.Text.constructFromObject({
    tabLabel: 'CompanyJurisdiction', value: args.CompanyJurisdiction
  });

  let ProjectTitleTab = docusign.Text.constructFromObject({
    tabLabel: 'ProjectTitle', value: args.ProjectTitle
  });

  let ProjectDescriptionTab = docusign.Text.constructFromObject({
    tabLabel: 'ProjectDescription', value: args.ProjectDescription
  });

  let ModuleTab = docusign.Text.constructFromObject({
    tabLabel: 'Module', value: args.Module
  });

  let ProgrammeTab = docusign.Text.constructFromObject({
    tabLabel: 'UniProgramme', value: args.Programme
  });

  let UniReferenceTab = docusign.Text.constructFromObject({
    tabLabel: 'UniReference', value: args.UniReference
  });

  let StudentTab = docusign.Text.constructFromObject({
    tabLabel: 'Student', value: args.Students
  });

  let LocationTab = docusign.Text.constructFromObject({
    tabLabel: 'Location', value: args.Location
  });

  let StartDateTab = docusign.Text.constructFromObject({
    tabLabel: 'StartDate', value: args.StartDate
  });

  let EndDateTab = docusign.Text.constructFromObject({
    tabLabel: 'EndDate', value: args.EndDate
  });

  let UniSupervisorTab = docusign.Text.constructFromObject({
    tabLabel: 'UniSupervisor', value: args.UniSupervisor
  });

  let isSupervisorTab = docusign.Text.constructFromObject({
    tabLabel: 'isSupervisor', value: args.isSupervisor
  });

  let isSupervisorEmailTab = docusign.Text.constructFromObject({
    tabLabel: 'isSupervisorEmail', value: args.isSupervisorEmail
  });

  let isSupervisorPosiitonTab = docusign.Text.constructFromObject({
    tabLabel: 'isSupervisorPosition', value: args.isSupervisorPosition
  });

  let OrgNoticesTab = docusign.Text.constructFromObject({
    tabLabel: 'OrgNotices', value: args.OrgNotices
  });

  let OrgNoticesEmailTab = docusign.Text.constructFromObject({
    tabLabel: 'OrgNoticesEmail', value: args.OrgNoticesEmail
  });

  let UCLTitleTab = docusign.Title.constructFromObject({
    tabLabel: 'UCLTitle', value: args.UCLTitle
  });

  let tabs = docusign.Tabs.constructFromObject({
    textTabs: [CompanyJurisTab, ProjectTitleTab, ProjectDescriptionTab, ModuleTab, ProgrammeTab, UniReferenceTab, StudentTab, LocationTab, StartDateTab, EndDateTab, UniSupervisorTab, isSupervisorTab, isSupervisorEmailTab, isSupervisorPosiitonTab, OrgNoticesTab, OrgNoticesEmailTab],
    titleTabs: [UCLTitleTab],
  });


  let CompanyTab = docusign.Company.constructFromObject({
    tabLabel: 'Company', value: args.Company
  });

  let CompanyTitleTab = docusign.Title.constructFromObject({
    tabLabel: 'CompanyTitle', value: args.OrgTitle
  });


  let tabs2 = docusign.Tabs.constructFromObject({
    companyTabs: [CompanyTab],
    titleTabs: [CompanyTitleTab],
  });

  // Create template role elements to connect UCL and the Company
  // to the template
  // We're setting the parameters via the object creation
  let Company = docusign.TemplateRole.constructFromObject({
    email: args.OrgEmail,
    name: args.OrgName,
    roleName: "Company",
    tabs: tabs2,
  });

  // We're setting the parameters via setters
  let UCL = docusign.TemplateRole.constructFromObject({
    email: args.UCLEmail,
    name: args.UCLName,
    roleName: "UCL",
    tabs: tabs,
  });


  // Add the TemplateRole objects to the envelope object
  env.templateRoles = [Company, UCL];
  env.status = args.status; // We want the envelope to be sent

  return env;
}

function makeEnvelopePDescriptionDocx(args) {

  // Create the docx file as a binary
  const templatePath = path.join(__dirname, 'Project_Terms.docx');
  const templateContent = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(templateContent);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const data = {
    Date: args.Date,

    Company: args.Company,
    CompanyJurisdiction: args.CompanyJurisdiction,

    ProjectTitle: args.ProjectTitle,
    ProjectDescription: args.ProjectDescription,

    Module: args.Module,
    Programme: args.Programme,
    UniReference: args.UniReference,

    Students: args.Students,
    Location: args.Location,

    StartDate: args.StartDate,
    EndDate: args.EndDate,

    UniSupervisor: args.UniSupervisor,

    isSupervisor: args.isSupervisor,
    isSupervisorEmail: args.isSupervisorEmail,
    isSupervisorPosition: args.isSupervisorPosition,

    OrgNotices: args.OrgNotices,
    OrgNoticesEmail: args.OrgNoticesEmail,

    OrgName: args.OrgName,
    OrgTitle: args.OrgTitle,

    UCLName: args.UCLName,
    UCLTitle: args.UCLTitle,
  };

  doc.setData(data);
  doc.render();
  const output = doc.getZip().generate({ type: 'nodebuffer' });

  // Create the envelope definition

  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = 'Please Sign Project Terms';

  const docxFile = new docusign.Document();
  docxFile.documentBase64 = output.toString('base64');
  docxFile.name = 'FilledTemplate.docx';
  docxFile.fileExtension = 'docx';
  docxFile.documentId = '1';

  env.documents = [docxFile];

  // crate a signer recipient to sign the document, identified by name and email. Parse through docx to locate signature location.
  let signer1 = docusign.Signer.constructFromObject({
    email: args.UCLEmail,
    name: args.UCLName,
    recipientId: '1',
    roleName: 'UCL'
  });

  let signer2 = docusign.Signer.constructFromObject({
    email: args.OrgEmail,
    name: args.OrgName,
    recipientId: '2',
    roleName: 'Company'
  });

  let signHere1 = docusign.SignHere.constructFromObject({
    anchorString: '**signature_2**',
    anchorYOffset: '0', anchorUnits: 'pixels',
    anchorXOffset: '0', required: true
  })
    , signHere2 = docusign.SignHere.constructFromObject({
      anchorString: '**signature_1**',
      anchorYOffset: '0', anchorUnits: 'pixels',
      anchorXOffset: '0', required: true
    })
    ;

  // Tabs are set per recipient / signer
  let signer1Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere1]
  });
  signer1.tabs = signer1Tabs;

  let signer2Tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere2]
  });
  signer2.tabs = signer2Tabs;

  // Add the recipients to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: [signer1, signer2]
  });
  env.recipients = recipients;

  env.status = args.status;

  return env;

}

module.exports = { sendEnvelopeFromTemplate, makeEnvelopeFramework, makeEnvelopeSLetter, makeEnvelopePDescription };