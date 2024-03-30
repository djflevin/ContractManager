var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for all framework agreements
router.get("/", async (req, res, next) => {
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let offset = (page - 1) * limit;

  let framework_agreements = await prisma.framework.findMany({
    include: { organisation: true, template: true },
    skip: offset,
    take: limit,
  });
  res.json(framework_agreements);
});

// GET request for one framework agreement
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let framework_agreement = await prisma.framework.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { organisation: true, template: true },
  });
  res.json(framework_agreement);
});

// Archive a student letter contract
router.post("/archive/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  archived = req.body.archived;
  let framework_agreement = await prisma.framework.update({
    where: { id: parseInt(req.params.id) },
    data: { isArchived: archived },
  });

  res.send({ success: true });
});

module.exports = router;
