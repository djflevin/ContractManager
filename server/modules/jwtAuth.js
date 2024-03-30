const docusign = require('docusign-esign');
const sendEnvelope = require('./docusign.js');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();

const jwtConfig = require('./jwtConfig.json');

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SCOPES = [
  "signature", "impersonation"
];


// This function should never run after the first time the user grants consent.
function getConsent() {
  var urlScopes = SCOPES.join('+');

  // Construct consent URL
  var redirectUri = "https://localhost";
  var consentUrl = `${jwtConfig.dsOauthServer}/oauth/auth?response_type=code&` +
    `scope=${urlScopes}&client_id=${jwtConfig.dsJWTClientId}&` +
    `redirect_uri=${redirectUri}`;

  console.log("Open the following URL in your browser to grant consent to the application:");
  console.log(consentUrl);
  console.log("Consent granted? \n 1)Yes \n 2)No");
  let consentGranted = prompt("");
  if (consentGranted == "1") {
    return true;
  } else {
    console.error("Please grant consent!");
    process.exit();
  }
}

async function authenticate() {
  const jwtLifeSec = 10 * 60, // requested lifetime for the JWT is 10 min
    dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace('https://', '')); // it should be domain only.
  let rsaKey = fs.readFileSync(path.resolve(jwtConfig.privateKeyLocation));

  try {
    const results = await dsApi.requestJWTUserToken(jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid, SCOPES, rsaKey,
      jwtLifeSec);
    const accessToken = results.body.access_token;

    // get user info
    const userInfoResults = await dsApi.getUserInfo(accessToken);

    // use the default account
    let userInfo = userInfoResults.accounts.find(account =>
      account.isDefault === "true");

    return {
      accessToken: results.body.access_token,
      apiAccountId: userInfo.accountId,
      basePath: `${userInfo.baseUri}/restapi`
    };
  } catch (e) {
    console.log(e);
    let body = e.response && e.response.body;
    // Determine the source of the error
    if (body) {
      // The user needs to grant consent
      if (body.error && body.error === 'consent_required') {
        if (getConsent()) { return authenticate(); };
      } else {
        // Consent has been granted. Show status code for DocuSign API error
        console.log(JSON.stringify(body, null, 4))
      }
    }
  }
}

async function getArgsFramework(apiAccountId, accessToken, basePath, id) {

  //get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  //call prisma and get prisma data
  const prismaData = await prisma.framework.findUnique({
    where: {
      id: id,
    },
    include: {
      organisation: true,
      template: true,
    }
  })

  const args = {
    accessToken: accessToken,
    basePath: basePath,
    accountId: apiAccountId,
    Date: today,
    Company: prismaData.organisation.name,
    CompanyRegister: prismaData.organisation.jurisdiction,

    //TODO: get the correct values for these
    UCLEmail: prismaData.uniSignatoryEmail,
    UCLName: prismaData.uniSignatory,
    UCLTitle: prismaData.uniSignatoryPosition,

    CompanyEmail: prismaData.orgSignatoryEmail,
    CompanyName: prismaData.orgSignatory,
    OrgTitle: prismaData.orgSignatoryPosition,

    templateId: prismaData.template.docusignId,
    status: "sent",
    oldStatus: prismaData.status,
  };
  return args
}

async function getArgsStudent(apiAccountId, accessToken, basePath, id) {

  //get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  //call prisma and get prisma data
  const prismaData = await prisma.studentLetter.findUnique({
    where: {
      id: id,
    },
    include: {
      template: true,
      student: true,
      project: {
        include: {
          programme: true,
          organisation: true,
        },
      },
    }
  });

  const args = {
    accessToken: accessToken,
    basePath: basePath,
    accountId: apiAccountId,
    Date: today,

    StudentName: prismaData.student.firstName + " " + prismaData.student.name,
    StudentEmail: prismaData.student.email,

    Company: prismaData.project.organisation.name,

    Module: prismaData.project.moduleCode,
    Programme: prismaData.project.programme.code,
    StudentReference: prismaData.studentReference,
    UCLEmail: prismaData.project.uniSignatoryEmail,
    UCLName: prismaData.project.uniSignatory,

    templateId: prismaData.template.docusignId,
    status: "sent",
    oldStatus: prismaData.status,
  };

  return args
}


async function getArgsProject(apiAccountId, accessToken, basePath, id) {

  //get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  //call prisma and get prisma data
  const prismaData = await prisma.projectDescription.findUnique({
    where: {
      id: id,
    },
    include: {
      template: true,
      project: {
        include: {
          organisation: true,
          students: true,
          programme: true,
        },
      },
    },
  }
  );

  var dd = String(prismaData.project.startDate.getDate()).padStart(2, '0');
  var mm = String(prismaData.project.startDate.getMonth() + 1).padStart(2, '0');
  var yyyy = prismaData.project.startDate.getFullYear();
  startDate = mm + '/' + dd + '/' + yyyy;

  var dd = String(prismaData.project.endDate.getDate()).padStart(2, '0');
  var mm = String(prismaData.project.endDate.getMonth() + 1).padStart(2, '0');
  var yyyy = prismaData.project.endDate.getFullYear();
  endDate = mm + '/' + dd + '/' + yyyy;

  const args = {
    accessToken: accessToken,
    basePath: basePath,
    accountId: apiAccountId,
    Date: today,

    Company: prismaData.project.organisation.name,
    CompanyJurisdiction: prismaData.project.organisation.jurisdiction,

    ProjectTitle: prismaData.project.title,
    ProjectDescription: prismaData.project.description,

    Module: prismaData.project.moduleCode,
    Programme: prismaData.project.programme.code,
    UniReference: prismaData.uniReference,

    Students: prismaData.project.students.map(getNameList),
    Location: prismaData.project.location,

    StartDate: startDate,
    EndDate: endDate,

    UniSupervisor: prismaData.project.uniSupervisor,

    isSupervisor: prismaData.project.isSupervisor,
    isSupervisorEmail: prismaData.project.isSupervisorEmail,
    isSupervisorPosition: prismaData.project.isSupervisorPosition,

    OrgNotices: prismaData.project.orgNotices,
    OrgNoticesEmail: prismaData.project.orgNoticesEmail,

    UCLEmail: prismaData.project.uniSignatoryEmail,
    UCLName: prismaData.project.uniSignatory,
    UCLTitle: prismaData.project.uniSignatoryPosition,

    OrgEmail: prismaData.project.orgSignatoryEmail,
    OrgName: prismaData.project.orgSignatory,
    OrgTitle: prismaData.project.orgSignatoryPosition,

    templateId: prismaData.template.docusignId,
    status: "sent",
    oldStatus: prismaData.status,
  };

  return args
}

function getNameList(item) {
  return [" " + item.firstName, item.name].join(" ");
}

async function updateFramework(envelopeInfo, id) {
  await prisma.framework.update({
    where: {
      id: id  //id is the id of the contract?
    },
    data: {
      link: "https://appdemo.docusign.com/documents/details/" + envelopeInfo.envelopeId,
      status: 'SENT',
      sentAt: envelopeInfo.statusDateTime,
      lastUpdated: envelopeInfo.statusDateTime,
      docusignId: envelopeInfo.envelopeId,
    },
  });
}

async function updateStudent(envelopeInfo, id) {
  await prisma.studentLetter.update({
    where: {
      id: id  //id is the id of the contract?
    },
    data: {
      link: "https://appdemo.docusign.com/documents/details/" + envelopeInfo.envelopeId,
      status: 'SENT',
      sentAt: envelopeInfo.statusDateTime,
      lastUpdated: envelopeInfo.statusDateTime,
      docusignId: envelopeInfo.envelopeId,
    },
  });
}

async function updateProject(envelopeInfo, id) {
  await prisma.projectDescription.update({
    where: {
      id: id  //id is the id of the contract?
    },
    data: {
      link: "https://appdemo.docusign.com/documents/details/" + envelopeInfo.envelopeId,
      status: 'SENT',
      sentAt: envelopeInfo.statusDateTime,
      lastUpdated: envelopeInfo.statusDateTime,
      docusignId: envelopeInfo.envelopeId,
    },
  });
}

async function SendContractsFramework(idlist) {
  let accountInfo = await authenticate();
  for (let id in idlist) {
    let args = getArgsFramework(accountInfo.apiAccountId, accountInfo.accessToken, accountInfo.basePath, idlist[id]);
    let contracttype = 1;
    args.then(async function (result) {
      console.log(result)
      try {
        if (result.oldStatus == "DRAFT") {
          let envelopeInfo = await sendEnvelope.sendEnvelopeFromTemplate(result, contracttype);
          if (envelopeInfo.envelopeId) {
            updateFramework(envelopeInfo, idlist[id]);
            console.log(envelopeInfo);
          }
        }
      } catch (error) {
        console.error('An error occurred while sending the envelope:', error);
      }
    });
  }
}


async function SendContractsStudent(idlist) {
  let accountInfo = await authenticate();
  for (let id in idlist) {
    let args = getArgsStudent(accountInfo.apiAccountId, accountInfo.accessToken, accountInfo.basePath, idlist[id]);
    let contracttype = 2;
    args.then(async function (result) {
      console.log(result);
      try {
        if (result.oldStatus == "DRAFT") {
          let envelopeInfo = await sendEnvelope.sendEnvelopeFromTemplate(result, contracttype);
          if (envelopeInfo.envelopeId) {
            updateStudent(envelopeInfo, idlist[id]);
            console.log(envelopeInfo);
          }
        }
      } catch (error) {
        console.error('An error occurred while sending the envelope:', error);
      }
    });
  }
}

async function SendContractsProject(idlist) {
  let accountInfo = await authenticate();
  for (let id in idlist) {
    let args = getArgsProject(accountInfo.apiAccountId, accountInfo.accessToken, accountInfo.basePath, idlist[id]);
    let contracttype = 3;
    args.then(async function (result) {
      console.log(result)
      try {
        if (result.oldStatus == "DRAFT") {
          let envelopeInfo = await sendEnvelope.sendEnvelopeFromTemplate(result, contracttype);
          if (envelopeInfo.envelopeId) {
            updateProject(envelopeInfo, idlist[id]);
            console.log(envelopeInfo);
          }
        }
      } catch (error) {
        console.error('An error occurred while sending the envelope:', error);
      }
    });
  }
}



module.exports = { SendContractsFramework, SendContractsStudent, SendContractsProject };
