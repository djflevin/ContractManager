import React from 'react';
import Buttton from '@mui/material/Button';
const client_id = process.env.REACT_APP_UCLAPI_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_UCLAPI_REDIRECT_URL;
const state = process.env.REACT_APP_UCLAPI_STATE;
// Login Button
function LoginButton() {
  // Login Function with UCL API OAuth
  const authorise_url = `https://uclapi.com/oauth/authorise?client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}`

  return (
    <Buttton onClick={() => {
      window.open(authorise_url, '_self');
    }}>Log in with UCL </Buttton>
  );
}

export default LoginButton;

