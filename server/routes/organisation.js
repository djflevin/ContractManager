var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for one organisation
router.get("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  let organisation = await prisma.organisation.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { projects: true, framework: true },
  });
  res.json(organisation);
});

// UPDATE request for one organisation
router.put("/:id", async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  // Unpack the data from the request
  const { name, juridiction, framework } = req.body;
  let organisation = await prisma.organisation.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name: name,
      juridiction: juridiction,
    },
  });
  // Additionally, update the framework template if it has been updated
  if (framework) {
    let updatedFramework = await prisma.framework.update({
      where: { id: parseInt(framework.id) },
      data: {
        templateId: parseInt(framework.templateId),
        uniSignatory: framework.uniSignatory,
        uniSignatoryEmail: framework.uniSignatoryEmail,
        uniSignatoryPosition: framework.uniSignatoryPosition,
        orgSignatory: framework.orgSignatory,
        orgSignatoryEmail: framework.orgSignatoryEmail,
        orgSignatoryPosition: framework.orgSignatoryPosition,
        lastUpdated: new Date(),
      },
    });
  }
  res.json(organisation);
});

module.exports = router;
