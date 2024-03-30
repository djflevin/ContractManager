var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Auth Middleware
const { authenticateAdminRole } = require("../modules/auth");

// GET request for one student letter template
router.get("/student_letter/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let template = await prisma.studentLetterTemplate.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {},
  });
  res.json(template);
});

// GET request for one project description template
router.get("/project_description/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let template = await prisma.projectDescriptionTemplate.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {},
  });
  res.json(template);
});

// GET request for one framework agreement template
router.get("/framework_agreement/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let template = await prisma.frameworkTemplate.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {},
  });
  res.json(template);
});

// GET request for all student letter templates
router.get("/student_letters", async (req, res, next) => {
  // Return all student letter templates
  let templates = await prisma.studentLetterTemplate.findMany({
    include: { studentLetters: false },
  });
  res.json(templates);
});

// GET request for all project description templates
router.get("/project_descriptions", async (req, res, next) => {
  let templates = await prisma.projectDescriptionTemplate.findMany({
    include: { projectDescriptions: false },
  });
  res.json(templates);
});

// GET request for all framework agreement templates
router.get("/framework_agreements", async (req, res, next) => {
  let templates = await prisma.frameworkTemplate.findMany({
    include: { frameworks: false },
  });
  res.json(templates);
});

/// ROUTES FOR CREATING AND UPDATING A TEMPLATE ///
// Restricted to admin users
router.use(authenticateAdminRole)

// POST request for creating a new student letter template
router.post("/student_letter", async (req, res, next) => {
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.studentLetterTemplate.create({
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
    },
  });
  res.json(template);
});

// POST request for creating a new project description template
router.post("/project_description", async (req, res, next) => {
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.projectDescriptionTemplate.create({
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
    },
  });
  res.json(template);
});

// POST request for creating a new framework agreement template
router.post("/framework_agreement", async (req, res, next) => {
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.frameworkTemplate.create({
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
    },
  });
  res.json(template);
});

// UPDATE request for student letter template
router.put("/student_letter/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.studentLetterTemplate.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
      isDefault: isDefault,
    },
  });
  // If the template is the default, set all other templates to not default and update them
  if (isDefault) {
    let templates = await prisma.studentLetterTemplate.findMany({
      where: { id: { not: template.id } },
    });
    templates.forEach(async (t) => {
      await prisma.studentLetterTemplate.update({
        where: { id: t.id },
        data: { isDefault: false },
      });
    });
  }
  res.json(template);
});

// UPDATE request for project description template
router.put("/project_description/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.projectDescriptionTemplate.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
      isDefault: isDefault,
    },
  });
  // If the template is the default, set all other templates to not default and update them
  if (isDefault) {
    let templates = await prisma.projectDescriptionTemplate.findMany({
      where: { id: { not: template.id } },
    });
    templates.forEach(async (t) => {
      await prisma.projectDescriptionTemplate.update({
        where: { id: t.id },
        data: { isDefault: false },
      });
    });
  }
  res.json(template);
});

// UPDATE request for framework agreement template
router.put("/framework_agreement/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const { name, docusignId, link, isDefault } = req.body;
  let template = await prisma.frameworkTemplate.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name: name,
      docusignId: docusignId,
      link: link,
      isDefault: isDefault,
    },
  });
  // If the template is the default, set all other templates to not default and update them
  if (isDefault) {
    let templates = await prisma.frameworkTemplate.findMany({
      where: { id: { not: template.id } },
    });
    templates.forEach(async (t) => {
      await prisma.frameworkTemplate.update({
        where: { id: t.id },
        data: { isDefault: false },
      });
    });
  }
  res.json(template);
});

module.exports = router;
