const axios = require("axios");
const jwt = require("jsonwebtoken");
const { PrismaClient, UserRole } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "some_secret";
const CLIENT_ID = process.env.NODE_APP_UCLAPI_CLIENT_ID;
const CLIENT_SECRET = process.env.NODE_APP_UCLAPI_CLIENT_SECRET;
const REDIRECT_URL = process.env.NODE_APP_UCLAPI_REDIRECT_URL;
const STATE = process.env.NODE_APP_UCLAPI_STATE;

async function handleLogin(code) {
  if (!code) {
    return null;
  }

  try {
    let token = await getUCLToken(code);
    let user_data = await getUserDataFromUCLAPI(token);

    // TODO: Uncomment this to enforce staff only in production
    // if (!ensureStaff(user_data)) {
    //   return null;
    // }

    localUser = await checkUserInDB(user_data);
    let jwt_token = await createToken(localUser);
    return jwt_token;

  } catch (err) {
    return null;
  }
}

async function ensureStaff(user_data) {
  if (!user_data || !user_data.is_staff) {
    return false
  }
  return true;
};

async function checkUserInDB(user_data) {
  // Find or create user in DB, and update details
  // TODO: Move to env var
  // Hardcoded list of admins
  const admins = ["daniel.levin.22@ucl.ac.uk", "dominic.kloecker.22@ucl.ac.uk", "joao.freitas.22@ucl.ac.uk", "wei.chen@ucl.ac.uk"];

  // Find and update user, or create user if they don't exist
  localUser = await prisma.user.upsert({
    where: {
      id: user_data.upi,
    },
    update: {
      email: user_data.mail,
      fullName: user_data.full_name,
    },
    create: {
      id: user_data.upi,
      email: user_data.mail,
      fullName: user_data.full_name,
      role:
        admins.includes(user_data.upi) || admins.includes(user_data.email)
          ? UserRole.ADMIN
          : UserRole.USER,
    },
  });

  // If user already exists, but is not an admin, check if they should be an admin
  if (
    localUser.role === UserRole.USER &&
    (admins.includes(localUser.email) || admins.includes(localUser.id))
  ) {
    return prisma.user.update({
      where: {
        id: localUser.id,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });
  }

  return localUser;
}

async function getUserDataFromUCLAPI(token) {
  // Get user data from UCL API using token
  let user_url = `https://uclapi.com/oauth/user/data?client_secret=${CLIENT_SECRET}&token=${token}`;
  let user_response = await axios.get(user_url);
  if (user_response.status !== 200) {
    return null;
  } else if (!user_response.data) {
    return null;
  }

  let user_data = user_response.data;
  return user_data;
}

function createToken(user_data) {
  // Create JWT token from user data and return token string. Expires in 2 hours
  let token = jwt.sign({ user_data }, JWT_SECRET, {
    expiresIn: 7200,
  });
  return token;
}

function verifyToken(token) {
  // Verify JWT token and return decoded token if valid
  if (!token) {
    return null;
  }
  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Decoded token", decoded);
    return decoded;
  } catch (err) {
    return null;
  }
}

function getUserFromToken(token) {
  // Unpack JWT token and return user data
  let decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }
  return decoded.user_data;
}

async function getUCLToken(code) {
  // Get token from UCL API using code from redirect 
  let token_url = `https://uclapi.com/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;
  let response = await axios.post(token_url);
  if (response.status !== 200) {
    return null;
  } else if (!response.data || !response.data.token) {
    return null;
  }

  let data = response.data;
  let token = data.token;
  return token;
}

async function authenticateToken(req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }

  // console.log("Authenticating token");
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("Auth header", authHeader);
  // console.log("Token", token);
  if (!token) {
    return res.sendStatus(401);
  }

  // If token exists but expired, return 401
  if (jwt.decode(token).exp < Date.now() / 1000) {
    return res.sendStatus(401);
  }

  // If token exists and is valid, continue
  let decoded = verifyToken(token);
  if (!decoded) {
    return res.sendStatus(403);
  }

  // req.user = decoded.user_data;
  next();
}

function authenticateAdminRole(req, res, next) {
  // Need to parse the token from the header as user_data is not stored in the req body
  if (req.method === "OPTIONS") {
    return next();
  }
  // Get token from header and decode 
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // If token does not exist, return 401 (unauthorized)
  if (!token) {
    return res.sendStatus(401);
  }
  // If token exists but expired, return 401 (unauthorized)
  if (jwt.decode(token).exp < Date.now() / 1000) {
    return res.sendStatus(401);
  }

  // If token exists but not valid, return 403 (forbidden)
  let decoded = verifyToken(token);
  if (!decoded) {
    return res.sendStatus(403);
  }
  let user = decoded.user_data;
  // If user is not an admin, return 403 (forbidden)
  if (user.role != UserRole.ADMIN) {
    return res.sendStatus(403);
  }
  next();
}

module.exports = {
  createToken,
  verifyToken,
  getUserFromToken,
  getUserDataFromUCLAPI,
  handleLogin,
  authenticateToken,
  authenticateAdminRole,
  checkUserInDB,
  ensureStaff,
};
