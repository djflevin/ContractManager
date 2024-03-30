var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { handleProjectUpload } = require("../modules/projects");

const { assembleCSVData } = require("../modules/csv_export");

/// ROUTES FOR UPLOADING PROJECTS ///
// POST request for uploading a list of projects from csv file
router.post("/upload", async (req, res, next) => {
  console.log("Uploading projects...");
  let projectList = req.body;
  try {
    let result = await handleProjectUpload(projectList);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error uploading projects" });
  }
});

/// Routes for CSV Export ///
router.get("/download", async (req, res, next) => {
  console.log("Downloading projects...");
  // Get all projects
  // res.send("Download projects");
  let data = await assembleCSVData();
  res.send(data);
});

// GET request for one project
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let project = await prisma.project.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      students: true,
      organisation: true,
      studentLetters: true,
      studentLetters: { include: { template: true, student: true } },
      // Include the template and project description for the student letter
      projectDescription: true,
      projectDescription: { include: { template: true } },
    },
  });
  res.json(project);
});

// UPDATE request for one project
router.put("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  // Unpack the data from the request
  const data = req.body;
  const projectDescription = data.projectDescription;
  const studentLetters = data.studentLetters;
  // Drop foreign keys from the data object before updating the project
  delete data.projectDescription;
  delete data.studentLetters;
  delete data.programme;
  delete data.organisation;
  delete data.students;

  let project = await prisma.project.update({
    where: { id: parseInt(req.params.id) },
    data: {
      ...data,
    },
  });

  // Additionally, update the project description template if it has been updated
  if (projectDescription) {
    let updatedProjectDescription = await prisma.projectDescription.update({
      where: { id: parseInt(projectDescription.id) },
      data: {
        templateId: parseInt(projectDescription.templateId),
        lastUpdated: new Date(),
      },
    });
  }

  // Additionally, update the student letter templates if they have been updated
  if (studentLetters) {
    for (let i = 0; i < studentLetters.length; i++) {
      let letter = await prisma.studentLetter.update({
        where: { id: parseInt(studentLetters[i].id) },
        data: {
          templateId: parseInt(studentLetters[i].templateId),
          lastUpdated: new Date(),
        },
      });
    }
  }

  res.json(project);
});

// GET request for all projects
router.get("/", async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let offset = (page - 1) * limit;

  let projects = await prisma.project.findMany({
    include: { students: true, organisation: true, programme: true },
    skip: offset,
    take: limit,
  });
  res.json(projects);
});

module.exports = router;
