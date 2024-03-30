const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const assembleCSVData = async (req, res) => {
  // Get all projects from the database
  const projects = await prisma.project.findMany({
    include: {
      organisation: true,
      projectDescription: true,
      studentLetters: true,
      students: true,
      programme: true,
    }
  });

  const csvHeaders = [
    "employment", "org_signatory_name", "org_signatory_email", "org_signatory_position", 
    "organisation", "org_jurisdiction", "project_title", "project_description", "module_code", 
    "module_year", "university_signatory_name", "university_signatory_email", "university_signatory_position", 
    "university_program", "university_reference", "location", "student_name", "start_date", "end_date", 
    "university_supervisor", "university_supervisor_email", "is_name", "is_position", "is_email", "org_notices_name", 
    "org_notices_email", "student_email", "student_reference", "student_first_name","student_id"
  ];

  const csvData = [];
  
  // Make a row for each student on each project and add it to the csvData array
  projects.forEach((project) => {
    project.students.forEach((student) => {
      const csvRow = {
        employment: project.employment || "",
        org_signatory_name: project.orgSignatory || "",
        org_signatory_email: project.orgSignatoryEmail || "",
        org_signatory_position: project.orgSignatoryPosition || "",
        organisation: project.organisation.name || "",
        org_jurisdiction: project.organisation.jurisdiction || "",
        project_title: project.title || "",
        project_description: project.description || "",
        module_code: project.moduleCode || "",
        module_year: project.moduleYear || "",
        university_signatory_name: project.uniSignatory || "",
        university_signatory_email: project.uniSignatoryEmail || "",
        university_signatory_position: project.uniSignatoryPosition || "",
        university_program: project.programme.name || "",
        university_reference: "" || "",
        location: project.location || "",
        student_name: student.name || "",
        start_date: project.startDate || "",
        end_date: project.endDate || "",
        university_supervisor: project.uniSupervisor || "",
        university_supervisor_email: project.uniSupervisorEmail || "",
        is_name: project.isSupervisor || "",
        is_position: project.isSupervisorPosition || "",
        is_email: project.isSupervisorEmail || "",
        org_notices_name: project.orgNotices || "",
        org_notices_email: project.orgNoticesEmail || "",
        student_email: student.email || "",
        student_reference: "" || "",
        student_first_name: student.firstName || "",
        student_id: student.id
      };
      csvData.push(csvRow);
    });
  });

  // Generate CSV string from the data
  const csvString = generateCSV(csvData, csvHeaders);


  return csvString;
}

const generateCSV = (data, headers) => {
  let csvString = headers.join(",") + "\n";
  data.forEach((row) => {
    // Ensure that the values are strings and 
    // Wrap the values in quotes if they contain a comma, a double quote or a new line
    const formattedRow = Object.values(row).map((value) => {
      value = value.toString();
      // Convert Boolean values to strings and Date objects to ISO strings
      if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
        value = "\"" + value.replace(/"/g, "\"\"") + "\"";
      }
      return value;
    }
  );
  csvString += formattedRow.join(",") + "\n";
  });

  return csvString;
}

exports.assembleCSVData = assembleCSVData;