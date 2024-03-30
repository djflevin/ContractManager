const express = require('express');
const bodyParser = require('body-parser');

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
app.use(bodyParser.json());


async function FindByDocuSignId(docuSignId) {
  try {
    const framework = await prisma.framework.findUnique({
      where: { docusignId: docuSignId },
    });
    if (framework) {
      return 'framework'
    }

    const studentLetter = await prisma.studentLetter.findUnique({
      where: { docusignId: docuSignId },
    });
    if (studentLetter) {
      return 'studentLetter'
    }

    const projectDescription = await prisma.projectDescription.findUnique({
      where: { docusignId: docuSignId },
    });
    if (projectDescription) {
      return 'projectDescription'
    }

    return 'No rows found with the given DocuSign ID.';
  } catch (error) {
    console.error(error);
    return 'An error occurred while finding the contract.';
  }
}

async function webhookListener(req, res) {
  console.log(req.body);
  const eventType = req.body.event;
  if (eventType === 'envelope-sent') {
    const envelopeId = req.body.data.envelopeId;
    const recipients = req.body.data.envelopeSummary.recipients.signers;
    let invalidEmails = [];
    let invalidRoles = [];

    recipients.forEach((recipient) => {
      if (recipient.status == 'autoresponded') {
        invalidEmails.push(recipient.email);
        invalidRoles.push(recipient.roleName);
      }
    });

    if (invalidEmails.length > 0) {
      console.log(`Envelope ${envelopeId} was sent to invalid email addresses: ${invalidEmails.join(', ')}`);
      // find contract type
      const contractType = await FindByDocuSignId(envelopeId);

      // Update database so that the invalid emails are not sent again
      for (let email in invalidEmails) {

        // update contract status to 'invalid email' and change email in database
        if (contractType == 'framework') {
          await prisma.framework.update({
            where: { docusignId: envelopeId},
            data: { status: 'DRAFT' },
          }); 

          if (invalidRoles[email] == 'UCL') {
            await prisma.framework.update({
              where: { docusignId: envelopeId },
              data: { uniSignatoryEmail: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          } else if (invalidRoles[email] == 'Company') {
            await prisma.framework.update({
              where: { docusignId: envelopeId },
              data: { orgSignatoryEmail: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          }
        } else if (contractType == 'studentLetter') {
          await prisma.studentLetter.update({
            where: { docusignId: envelopeId },
            data: { status: 'DRAFT' },
          });

          if (invalidRoles[email] == 'Student') {
            await prisma.student.update({
              where: { email: invalidEmails[email]},
              data: { email: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          } else if (invalidRoles[email] == 'UCL') {
            await prisma.project.update({
              where: { uniSignatoryEmail: invalidEmails[email] },
              data: { uniSignatoryEmail: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          }
        } else if (contractType == 'projectDescription') {
          await prisma.projectDescription.update({
            where: { docusignId: envelopeId },
            data: { status: 'DRAFT' },
          });

          if (invalidRoles[email] == 'UCL') {
            await prisma.project.update({
              where: { uniSignatoryEmail: invalidEmails[email] },
              data: { uniSignatoryEmail: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          } else if (invalidRoles[email] == 'Company') {
            await prisma.project.update({
              where: { orgSignatoryEmail: invalidEmails[email]},
              data: { orgSignatoryEmail: 'PLEASE REVIEW OLD EMAIL -' + invalidEmails[email] },
            });

          }
        }
      }
    } else {
      console.log(`Envelope ${envelopeId} was sent successfully`);
      
    }

  } else if (eventType === 'recipient-completed') {

    const envelopeId = req.body.data.envelopeId;
    const recipients = req.body.data.envelopeSummary.recipients.signers;
    let signedEmails = [];
    let signedRoles = [];

    //Adds completed Signers and their roles to the array
    recipients.forEach((recipient) => {
      if (recipient.status == 'completed') {
        signedEmails.push(recipient.email);
        signedRoles.push(recipient.roleName);
      }
    });

    console.log(`Envelope ${envelopeId} was signed by email addresses: ${signedEmails.join(', ')}`);

    const contractType = await FindByDocuSignId(envelopeId);
    
    // Update database with the correct signed status

    for (let email in signedEmails) {
      // change signed staatus of contract depending on source of webhook
      if (contractType == 'framework') {
        if (signedRoles[email] == 'UCL') {
          await prisma.framework.update({
            where: { docusignId: envelopeId },
            data: { uniSigned: true},
          });

        } else if (signedRoles[email] == 'Company') {
          await prisma.framework.update({
            where: { docusignId: envelopeId },
            data: { orgSigned:  true},
          });
        }
      // check if both uniSigned and orgSigned == true and change status

      const prismaData = await prisma.framework.findUnique({
        where: {
          docusignId: envelopeId,
        },
      });

      if(prismaData.uniSigned == prismaData.orgSigned == true){
        await prisma.framework.update({
          where: { docusignId: envelopeId },
          data: { status:  'SIGNED'},
        });

      }
      
      } else if (contractType == 'studentLetter') {
        // change signed staatus of contract depending on source of webhook

        if (signedRoles[email] == 'Student') {
          await prisma.studentLetter.update({
            where: { docusignId: envelopeId},
            data: { studentSigned: true },
          });
        } else if (signedRoles[email] == 'UCL') {
          await prisma.studentLetter.update({
            where: { docusignId: envelopeId},
            data: { uniSigned: true },
          });
        }
        // check if both uniSigned and studentSigned == true and change status 

        const prismaData = await prisma.studentLetter.findUnique({
          where: {
            docusignId: envelopeId,
          },
        });
  
        if(prismaData.uniSigned == prismaData.studentSigned == true){
          await prisma.studentLetter.update({
            where: { docusignId: envelopeId },
            data: { status:  'SIGNED'},
          });
  
        }

      } else if (contractType == 'projectDescription') {
        // change signed staatus of contract depending on source of webhook

        if (signedRoles[email] == 'UCL') {
          await prisma.projectDescription.update({
            where: { docusignId: envelopeId},
            data: { uniSigned: true },
          });
        } else if (signedRoles[email] == 'Company') {
          await prisma.projectDescription.update({
            where: { docusignId: envelopeId},
            data: { orgSigned: true },
          });
        }
        //check if both org and uniSigned == true and change status

        const prismaData = await prisma.projectDescription.findUnique({
          where: {
            docusignId: envelopeId,
          },
        });
  
        if(prismaData.uniSigned == prismaData.orgSigned == true){
          await prisma.projectDescription.update({
            where: { docusignId: envelopeId },
            data: { status:  'SIGNED'},
          });
  
        }
      }
    }

  }

  res.sendStatus(200);
}

module.exports = {
  webhookListener
};