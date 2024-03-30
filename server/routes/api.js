var express = require("express");
var router = express.Router();
const { authenticateToken } = require("../modules/auth");

var axios = require("axios");
var jwt = require("jsonwebtoken");
var jwtAuth = require("../modules/jwtAuth.js");

// Auth Imports
// IMPORT AUTH MODULES
const { SendContract } = require("../modules/jwtAuth.js");

router.use(["/user", "/ucl"], require("./auth"));

router.use(authenticateToken);

router.use("/data", require("./data"));

router.use(["/framework_agreement","/framework_agreements"], require("./framework_agreements"));

router.use("/organisation", require("./organisation"));

router.use(["/programme", "/programmes"], require("./programme"));

router.use(["/project_description", "/project_descriptions"], require("./project_description"));

router.use(["/project", "/projects"], require("./project"));

router.use(["/student_letter", "/student_letters"], require("./student_letter"));

router.use("/student" , require("./student"));

router.use(["/template", "/templates"], require("./template"));

router.post("/send/framework_agreements", async (req, res, next) => {
  // call to function to send Contracts //
  jwtAuth.SendContractsFramework(req.body.contract_ids);
});

router.post("/send/project_descriptions", async (req, res, next) => {
  // call to function to send Contracts //
  jwtAuth.SendContractsProject(req.body.contract_ids);
});

router.post("/send/student_letters", async (req, res, next) => {
  // call to function to send Contracts //
  jwtAuth.SendContractsStudent(req.body.contract_ids);
});

module.exports = router;
