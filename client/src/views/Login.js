 import React from "react";
import * as mui from "@mui/material";

import MainCard from "../components/base/MainCard";
import Grid from '@mui/material/Grid';
import LoginButton from '../components/auth/LoginButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardActionArea from "@mui/material/CardActionArea";

import { useSignIn } from "react-auth-kit";
import { getToken, getUser } from "../auth/auth";

const Login = () => {

  const signIn = useSignIn();

  // On Page load, see if there is a token in in local storage, if so, sign in with it 
  React.useEffect(() => {
    const token = getToken();
    if (token) {
      const res = getUser();
      if (res && res.data && res.data.user) {
        signIn({
          token: res.data.token,
          tokenType: "Bearer",
          expiresIn: 3600,
          authState: res.data.user,
        });
      }
    }
  }, []);

  return (
    // Login Page (Should overwrite the default page) 
    <Grid container justifyContent="center" alignItems="center" backgroundColor="primary.main" height="100vh">
      <Grid item xs={4}>
        <MainCard title="Login">
          <Typography variant="h6" component="div" gutterBottom>
            
          </Typography>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstageclip.com%2Fwp-content%2Fuploads%2F2019%2F03%2FUniversity_College_London_logo.svg-1024x300.png&f=1&nofb=1&ipt=6996f3fafc6ec750e97261059a82befacc9a422a8d2119a9f2fe9ba4cfb464e8&ipo=images"
              alt="UCL Logo"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                UCL (SSO)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IXN Project Management System is only available to UCL staff. Please login with your UCL SSO account to proceed.
              </Typography>
            </CardContent>
            
          </CardActionArea>
          
          <CardActions>
              <LoginButton />
          </CardActions>

        </MainCard>
      </Grid>
    </Grid>
  )
}

export default Login;
