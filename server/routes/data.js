var express = require("express");
var router = express.Router();

const { contractAnalytics } = require("../modules/contractAnalytics");

// Note: Do not name any routes /analytics/... as they will be blocked by adblockers

// GET request for contract analytics
router.get("/contracts", async (req, res) => {
  // Unpack the filter data from the request
  let timeFrame = req.query.timeFrame;
  let programme = req.query.programme;
  let projectStatus = req.query.projectStatus;
  const data = await contractAnalytics(timeFrame, programme, projectStatus);
  res.json(data);
});

module.exports = router;
