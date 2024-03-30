var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for all student letter contracts
router.get("/", async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let offset = (page - 1) * limit;

  let student_letters = await prisma.studentLetter.findMany({
    include: {
      student: true,
      template: true,
      project: true,
      project: { include: { programme: true, organisation: true } },
    },
    skip: offset,
    take: limit,
  });
  res.json(student_letters);
});

// GET request for one student letter contract
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let student_letter = await prisma.studentLetter.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { student: true, template: true, project: true },
  });
  res.json(student_letter);
});

// Archive a student letter contract
router.post("/archive/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  archived = req.body.archived;
  let student_letter = await prisma.studentLetter.update({
    where: { id: parseInt(req.params.id) },
    data: { isArchived: archived },
  });

  res.send({ success: true });
});

module.exports = router;
