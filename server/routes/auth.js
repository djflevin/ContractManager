var express = require("express");
var router = express.Router( {mergeParams: true} );

// Auth imports
const {
  getUserFromToken,
  handleLogin,
} = require("../modules/auth");

router.get("/", function (req, res, next) {
  let token = req.headers.authorization;

  let user = getUserFromToken(token.split(" ")[1]);

  res.send({
    user: user,
    token: token ? token.split(" ")[1] : null,
  });
});

// Callback route for ucl authFF
router.get("/callback", async function (req, res, next) {
  let resp_code = req.query.code;
  let jwt = await handleLogin(resp_code);
  // Redirect to the client with the jwt token
  res.redirect(process.env.REACT_CLIENT_URL + "/callback?token=" + jwt);
});

module.exports = router;