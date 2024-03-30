// Import js cookie
import Cookies from 'js-cookie';
// Auth Functions 
import axios from 'axios';

// Import .env variables 
const client_id = process.env.REACT_APP_UCLAPI_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_UCLAPI_REDIRECT_URL;
// const authorise_url = `https://uclapi.com/oauth/authorise?client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`

function authorise_url () {
  // Generate random state
  let state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Set state as cookie
  // Return authorise url
  return `https://uclapi.com/oauth/authorise?client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`
}

// Get user with callback token
function getUserFromCallback(token) {
  return axios.get('/user', {
    headers : { Authorization: `Bearer ${token}` }
  });
}

// Get user with stored token
function getUser() {
  return axios.get('/user', {
    headers : { Authorization: `${getToken()}` }
  })
}

function getToken() {
  // Token saved as Bearer Token in cookie '_auth'
  return Cookies.get('_auth');
}

// Export Compnents and Functions
export { getToken, getUserFromCallback, getUser, authorise_url };

