var express = require("express");
var router = express.Router();

// Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET request for one student
router.get("/:id", async (req, res, next) => {
  try {
    let student = await prisma.student.findUnique({
      where: { id: req.params.id },
      include: {
        projects: true,
        letters: true,
        letters: { include: { template: true, project: true } },
      },
    });
    res.json(student);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Invalid ID" });
  }

});

// UPDATE request for one student
router.put("/:id", async (req, res, next) => {
  try {
    const { name, firstName, email, letters } = req.body;
    let student = await prisma.student.update({
      where: { id: req.params.id },
      data: {
        name: name,
        firstName: firstName,
        email: email,
      },
    });
    // Additionally, update the student letter templates if they have been updated
    if (letters) {
      for (let i = 0; i < letters.length; i++) {
        let letter = await prisma.studentLetter.update({
          where: { id: parseInt(letters[i].id) },
          data: {
            templateId: parseInt(letters[i].templateId),
            lastUpdated: new Date(),
          },
        });
      }
    }
    res.json(student);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Invalid ID" });
  }
});

module.exports = router;
