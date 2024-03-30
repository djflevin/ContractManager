const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleProjectUpload = async (projectList) => {
  const results = {
    newOrganisations: 0,
    newProgrammes: 0,
    newProjects: 0,
    newStudents: 0,
    newFrameworkAgreements: 0,
    newProjectDescriptions: 0,
    newStudentLetters: 0,
  }

  // Get the default templates from the database to use when creating new records
  const defaultFrameworkAgreement = await prisma.frameworkTemplate.findFirst({
    where: { isDefault: true },
  });

  const defaultProjectDescription = await prisma.projectDescriptionTemplate.findFirst({
    where: { isDefault: true },
  });

  const defaultStudentLetter = await prisma.studentLetterTemplate.findFirst({
    where: { isDefault: true },
  });

  // If any of the default templates are not found, return an error message and stop the function
  if (!defaultFrameworkAgreement || !defaultProjectDescription || !defaultStudentLetter) {
    return {
      success: false,
      message: "Default templates not found",
    };
  }

  // Loop through each project in the project list
  // Wrap in a try catch to catch any errors that may occur during the loop
  for (const projectData of projectList) {
    try {
      // Check if Organisation Exists and Create if not
      const { orgCreated, frameworkModel, orgModel } = await createIfNotExistsOrganisation(
        projectData, defaultFrameworkAgreement);

      // Check if Programme Exists and Create if not
      const { programmeCreated, programmeModel } = await createIfNotExistsProgramme(
        projectData);

      // Check if Project Exists and Create if not
      const { projectCreated, projectModel } = await createIfNotExistsProject(
        projectData, orgModel, programmeModel, defaultProjectDescription);

      // Check if Student Exists and Create if not
      const { studentCreated, studentModel } = await createIfNotExistsStudent(
        projectData, projectModel, defaultStudentLetter);

      // Update Results Object with the number of new records created in each table 
      results.newOrganisations += orgCreated.organisation ? 1 : 0;
      results.newFrameworkAgreements += orgCreated.frameworkAgreement ? 1 : 0;
      results.newProgrammes += programmeCreated ? 1 : 0;
      results.newProjects += projectCreated.project ? 1 : 0;
      results.newProjectDescriptions += projectCreated.projectDescription ? 1 : 0;
      results.newStudents += studentCreated.student ? 1 : 0;
      results.newStudentLetters += studentCreated.studentLetter ? 1 : 0;

    }
    catch (err) {
      console.log(err);
    }
  }

  // Return the results object
  return results;
}


const createIfNotExistsOrganisation = async (data, defaultFrameworkAgreement) => {
  const orgCreated = {
    organisation: false,
    frameworkAgreement: false,
  }

  const {
    organisation,
    org_jurisdiction,
    org_signatory_name,
    org_signatory_email,
    org_signatory_position,
    university_signatory_name,
    university_signatory_email,
    university_signatory_position,
  } = data;

  // Check if Organisation Exists
  const org = await prisma.organisation.findUnique({
    where: { name: organisation },
  });

  // If Organisation Exists, return
  if (org) {
    // If Org Exists, Framework Agreement Should Exist
    const framework = await prisma.framework.findUnique({
      where: { organisationId: org.id },
    });

    return { orgCreated, frameworkModel: framework, orgModel: org }
  }

  // If Organisation Does Not Exist, Create Organisation and Framework Agreement
  const orgModel = await prisma.organisation.create({
    data: {
      name: organisation,
      jurisdiction: org_jurisdiction,
    },
  });

  const frameworkModel = await prisma.framework.create({
    data: {
      organisationId: orgModel.id,
      templateId: defaultFrameworkAgreement.id,
      orgSignatory: org_signatory_name,
      orgSignatoryEmail: org_signatory_email,
      orgSignatoryPosition: org_signatory_position,
      uniSignatory: university_signatory_name,
      uniSignatoryEmail: university_signatory_email,
      uniSignatoryPosition: university_signatory_position,
    },
  });

  orgCreated.organisation = true;
  orgCreated.frameworkAgreement = true;

  return { orgCreated, frameworkModel: frameworkModel, orgModel: orgModel }
}

const createIfNotExistsProgramme = async (data) => {
  const {
    university_program,
  } = data;

  // Check if Programme Exists
  const programme = await prisma.programme.findFirst({
    where: { code: university_program },
  });

  if (programme) {
    return { programmeCreated: false, programmeModel: programme }
  }

  // If Programme Does Not Exist, Create Programme
  const programmeModel = await prisma.programme.create({
    data: {
      code: university_program,
    },
  });

  return { programmeCreated: true, programmeModel: programmeModel };
}

const createIfNotExistsProject = async (data, orgModel, programmeModel, defaultProjectDescription) => {
  // console.  log(data)
  const {
    organisation,
    org_jurisdiction,
    org_signatory_name,
    org_signatory_email,
    org_signatory_position,
    university_program,
    university_signatory_name,
    university_signatory_email,
    university_signatory_position,
    university_reference,
    project_title,
    project_description,
    start_date,
    end_date,
    university_supervisor,
    university_supervisor_email,
    org_notices_name,
    org_notices_email,
    is_name,
    is_position,
    is_email,
    module_code,
    module_year,
    employment,
    location,
    student_name,
    student_email,
    student_reference,
    student_first_name,
  } = data;

  const projectCreated = {
    project: false,
    projectDescription: false,
  }

  // Check if Project Exists
  const project = await prisma.project.findUnique({
    where: { title: project_title },
  });

  // If Project Exists, return
  if (project) {
    const projectDescription = await prisma.projectDescription.findUnique({
      where: { projectId: project.id },
    });

    return { projectCreated, projectModel: project, projectDescriptionModel: projectDescription }
  }

  // Parse dates to Date object
  // As dates are input in DD/MM/YYYY format, we need to convert to YYYY-MM-DD
  // JavaScript Date requires MM/DD/YYYY format
  const convertData = (date) => {
    const [day, month, year] = date.split('/');
    return new Date(`${month}/${day}/${year}`);
  }

  const startDate = convertData(start_date);
  const endDate = convertData(end_date);

  // If Project Does Not Exist, Create Project and Project Description
  const projectModel = await prisma.project.create({
    data: {
      title: project_title,
      description: project_description,
      startDate: startDate,
      endDate: endDate,
      location: location,
      uniSignatory: university_signatory_name,
      uniSignatoryEmail: university_signatory_email,
      uniSignatoryPosition: university_signatory_position,
      uniSupervisor: university_supervisor,
      uniSupervisorEmail: university_supervisor_email,
      orgSignatory: org_signatory_name,
      orgSignatoryEmail: org_signatory_email,
      orgSignatoryPosition: org_signatory_position,
      orgNotices: org_notices_name,
      orgNoticesEmail: org_notices_email,
      isSupervisor: is_name,
      isSupervisorEmail: is_email,
      isSupervisorPosition: is_position,
      moduleCode: module_code,
      moduleYear: parseInt(module_year) || 0,
      employment: employment,
      organisationId: orgModel.id,
      programmeId: programmeModel.id,
    },
  });

  // Create Project Description
  const projectDescriptionModel = await prisma.projectDescription.create({
    data: {
      projectId: projectModel.id,
      templateId: defaultProjectDescription.id,
      uniReference: (projectModel.moduleYear).toString() + "_" + projectModel.moduleCode + "_" + (projectModel.id).toString() + "_CC"
    },
  });

  projectCreated.project = true;
  projectCreated.projectDescription = true;

  return { projectCreated, projectModel: projectModel, projectDescriptionModel: projectDescriptionModel }
}

const createIfNotExistsStudent = async (data, projectModel, defaultStudentLetter) => {
  const {
    student_name,
    student_email,
    student_first_name,
    student_id
  } = data;

  const studentCreated = {
    student: false,
    studentLetter: false,
  }

  // Check if Student Exists
  const student = await prisma.student.findUnique({
    where: { id: student_id },
  });

  if (student) {
    // See if the student alerady has a student letter for this project and if so, return
    const studentLetter = await prisma.studentLetter.findFirst({
      where: {
        studentId: student.id,
        projectId: projectModel.id,
      },
    });

    if (studentLetter) {
      return { studentCreated, studentModel: student, studentLetterModel: studentLetter }
    }

    // Create the student letter
    const studentLetterModel = await prisma.studentLetter.create({
      data: {
        studentId: student.id,
        projectId: projectModel.id,
        templateId: defaultStudentLetter.id,
        studentReference: (projectModel.moduleYear).toString() + "_" + projectModel.moduleCode + "_" + (student.id).toString() + "_SC"
      },
    });

    // Link the student to the project
    const projectStudentModel = await prisma.project.update({
      where: { id: projectModel.id },
      data: {
        students: {
          connect: {
            id: student.id,
          },
        },
      },
    });

    studentCreated.studentLetter = true;
    return { studentCreated, studentModel: student, studentLetterModel: studentLetterModel }
  }

  // Create the student
  const studentModel = await prisma.student.create({
    data: {
      id: student_id,
      name: student_name,
      email: student_email,
      firstName: student_first_name,
    },

  });

  // Create the student letter
  const studentLetterModel = await prisma.studentLetter.create({
    data: {
      studentId: studentModel.id,
      projectId: projectModel.id,
      templateId: defaultStudentLetter.id,
      studentReference: (projectModel.moduleYear).toString() + "_" + projectModel.moduleCode + "_" + (studentModel.id).toString() + "_SC"
    },
  });

  // // Link the student to the project
  const projectStudentModel = await prisma.project.update({
    where: { id: projectModel.id },
    data: {
      students: {
        connect: {
          id: studentModel.id,
        },
      },
    },
  });

  studentCreated.student = true;
  studentCreated.studentLetter = true;

  return { studentCreated, studentModel: studentModel, studentLetterModel: studentLetterModel }
}

module.exports = {
  handleProjectUpload,
  createIfNotExistsOrganisation,
  createIfNotExistsProgramme,
  createIfNotExistsProject,
  createIfNotExistsStudent,
};
