var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for all programmes
router.get("/", async (req, res, next) => {
  let programmes = await prisma.programme.findMany({
    include: { projects: false },
  });
  res.json(programmes);
});

module.exports = router;
