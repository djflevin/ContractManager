var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for one project description contract
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let project_description = await prisma.projectDescription.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { project: true, template: true },
  });
  res.json(project_description);
});

// Archive a student letter contract
router.post("/archive/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  archived = req.body.archived;
  let project_description = await prisma.projectDescription.update({
    where: { id: parseInt(req.params.id) },
    data: { isArchived: archived },
  });

  res.send({ success: true });
});


// GET request for all project description contracts
router.get("/", async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let offset = (page - 1) * limit;

  let project_descriptions = await prisma.projectDescription.findMany({
    include: {
      project: true,
      template: true,
      project: { include: { programme: true, organisation: true } },
    },
    skip: offset,
    take: limit,
  });
  res.json(project_descriptions);
});

module.exports = router;
