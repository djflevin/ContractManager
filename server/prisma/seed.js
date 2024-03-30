const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const Math = require("mathjs");

const prisma = new PrismaClient();

async function main() {
  // Run npx prisma migrate reset, npx prisma db push before calling this

  const amountOfData = 15;

  // Generate templates
  const frameworkTemplate = await prisma.frameworkTemplate.create({
    data: {
      name: "Default Framework Template",
      docusignId: "7d8af70f-4aa9-40fd-859d-6f4915bc0d44",
      isDefault: true,
    },
  });

  const projectDescriptionTemplate =
    await prisma.projectDescriptionTemplate.create({
      data: {
        name: "Default Project Description Template",
        docusignId: "docx",
        isDefault: true,
      },
    });

  const studentLetterTemplate = await prisma.studentLetterTemplate.create({
    data: {
      name: "Default Student Letter Template",
      docusignId: "5858d22f-df58-4bff-8357-4045776380d9",
      isDefault: true,
    },
  });

  // Generate students
  const amountOfStudents = amountOfData;
  const studentsData = [];
  for (let i = 0; i < amountOfStudents; i++) {
    const student = {
      name: faker.name.lastName(),
      firstName: faker.name.firstName(),
      email: faker.internet.email(),
    };
    studentsData.push(student);
  }
  await prisma.student.createMany({ data: studentsData });
  const students = await prisma.student.findMany();

  // Generate organisations
  const amountOfOrganisations = amountOfData;
  const organisationsData = [];
  for (let i = 0; i < amountOfOrganisations; i++) {
    const organisation = {
      name: faker.company.name(),
      jurisdiction: faker.address.country(),
    };
    organisationsData.push(organisation);
  }
  await prisma.organisation.createMany({ data: organisationsData });
  const organisations = await prisma.organisation.findMany();

  // Generate framework for every organisation
  frameworks = [];
  organisations.forEach(async (organisation) => {
    let fakeSupervisor = faker.name.fullName();
    const framework = {
      templateId: frameworkTemplate.id,
      organisationId: organisation.id,
      orgSigned: faker.datatype.boolean(),
      uniSigned: faker.datatype.boolean(),
      orgSignatory: fakeSupervisor,
      orgSignatoryEmail: faker.internet.email(),
      orgSignatoryPosition: faker.name.jobTitle(),
      uniSignatory: fakeSupervisor,
      uniSignatoryEmail: faker.internet.email(),
      uniSignatoryPosition: faker.name.jobTitle(),
      status: ["DRAFT", "SENT", "SIGNED"][Math.floor(Math.random() * 3)],
    };
    frameworks.push(framework);
  });
  await prisma.framework.createMany({ data: frameworks });

  // Generate programmes
  // More realistic number of programmes
  const amountOfProgrammes = Math.floor(amountOfData / 3);
  const programmesData = [];
  for (let i = 0; i < amountOfProgrammes; i++) {
    const programme = {
      code: ['COMP_', 'ML_', 'Math_'][Math.floor(Math.random() * 3)] + Math.floor(Math.random() * 100).toString(),
    };
    programmesData.push(programme);
  }
  await prisma.programme.createMany({ data: programmesData });
  const programmes = await prisma.programme.findMany();

  // Generate a project for every organisation
  const projectsData = [];
  organisations.forEach(async (organisation) => {
    let fakeSupervisor = faker.name.fullName();
    let fakeSignatory = faker.name.fullName();
    let fakeNotices = faker.name.fullName();
    let fakeIsSupervisor = faker.name.fullName();
    let fakeModule = ['COMP_', 'ML_', 'Math_'][Math.floor(Math.random() * 3)] + Math.floor(Math.random() * 100).toString();

    const project = {
      organisationId: organisation.id,
      programmeId: programmes[Math.floor(Math.random() * programmes.length)].id,
      title: faker.company.bs(),
      description: faker.lorem.paragraphs(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      status: ["ACTIVE", "INACTIVE"][Math.floor(Math.random() * 2)],
      uniSignatory: "Professor Stephen Hailes",
      uniSignatoryPosition: "Head of Department, Computer Science",
      uniSignatoryEmail: "s.hailes@ucl.ac.uk",
      uniSupervisor: `Dr ${fakeSupervisor}`,
      uniSupervisorEmail: `${fakeSupervisor
        .toLowerCase()
        .replace(" ", ".")}@ucl.ac.uk`,
      orgSignatory: fakeSignatory,
      orgSignatoryPosition: faker.name.jobTitle(),
      orgSignatoryEmail: `${fakeSignatory
        .toLowerCase()
        .replace(" ", ".")}@${faker.internet.domainName()}}`,
      orgNotices: fakeNotices,
      orgNoticesEmail: `${fakeNotices
        .toLowerCase()
        .replace(" ", ".")}@${faker.internet.domainName()}}`,
      isSupervisor: fakeIsSupervisor,
      isSupervisorPosition: faker.name.jobTitle(),
      isSupervisorEmail: `${fakeIsSupervisor
        .toLowerCase()
        .replace(" ", ".")}@${faker.internet.domainName()}}`,
      moduleCode: fakeModule,
      moduleYear: Math.floor(Math.random() * 4) + 1,
    };
    projectsData.push(project);
  });
  await prisma.project.createMany({ data: projectsData });
  const projectsWithoutStudents = await prisma.project.findMany();

  // Assign projects to students
  for (const project of projectsWithoutStudents) {
    const student = students[Math.floor(Math.random() * students.length)];
    await prisma.project.update({
      where: { id: project.id },
      data: {
        students: {
          connect: {
            id: student.id,
          },
        },
      },
    });
  };


  const projects = await prisma.project.findMany({
    include: { students: true },
  });

  // Generate a project description for every project
  const projectDescriptionsData = [];
  projects.forEach(async (project) => {
    const projectDescription = {
      templateId: projectDescriptionTemplate.id,
      projectId: project.id,
      orgSigned: faker.datatype.boolean(),
      uniSigned: faker.datatype.boolean(),
      uniReference: (project.moduleYear).toString() + "_" + project.moduleCode + "_" + (project.id).toString() + "_CC",
      status: ["DRAFT", "SENT", "SIGNED"][Math.floor(Math.random() * 3)],
    };
    projectDescriptionsData.push(projectDescription);
  });
  await prisma.projectDescription.createMany({ data: projectDescriptionsData });
  // Generate a student letter for every student in every project
  const studentLettersData = [];
  for (const project of projects) {
    for (const student of project.students) {
      const studentLetter = {
        studentId: student.id,
        templateId: studentLetterTemplate.id,
        projectId: project.id,
        uniSigned: faker.datatype.boolean(),
        studentSigned: faker.datatype.boolean(),
        studentReference: (project.moduleYear).toString() + "_" + project.moduleCode + "_" + (student.id).toString() + "_SC",
        status: ["DRAFT", "SENT", "SIGNED"][Math.floor(Math.random() * 3)],
      };
      studentLettersData.push(studentLetter);
    }
  }
  await prisma.studentLetter.createMany({ data: studentLettersData });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
