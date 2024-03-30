// src/hooks/useLoginCallback.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { getUserFromCallback } from '../auth/auth';
// src/pages/Callback.js
import React from 'react';
import MainCard from '../components/base/MainCard';
import axios from 'axios';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Custom hook to handle the login callback
export const useLoginCallback = (token) => {
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const dispatch = useDispatch();
  const signIn = useSignIn();
  const navigate = useNavigate();

  // On page load, check if there is a token in the url and get the user data from the backend
  useEffect(() => {
    const Login = async () => {
      const res = await getUserFromCallback(token);
      if (!res || !res.data || !res.data.user) {
        console.log('Error: No user data returned');
        setShouldNavigate(true);
      } else {
        const signedIn = signIn({
          token: res.data.token,
          tokenType: 'Bearer',
          expiresIn: 3600,
          authState: res.data.user,
        });
        if (signedIn) {
          setIsSignedIn(true);
        } else {
          console.error('Error during signIn');
        }
        // Ensure the authHeader is set in the axios instance before navigating 
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        // Dispatch the user data to the redux store
        setShouldNavigate(true);
      }
      setIsLoading(false);
    };

    Login();
  }, [token, signIn, dispatch]);

  // Check if the user is signed in and navigate to the correct page
  // Dependent on the shouldNavigate state variable and the isSignedIn state variable (which is set in the useEffect above)
  useEffect(() => {
    if (shouldNavigate) {
      if (isSignedIn) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [shouldNavigate, isSignedIn, navigate]);

  return { isLoading };
};


// Callback component
const Callback = () => {
  // Parse the token from the url
  const url = window.location.href;
  const token = url.split('token=')[1];

  // Use the custom hook to handle the login callback
  const { isLoading } = useLoginCallback(token);

  // Show a loading spinner while the user data is being fetched
  if (isLoading) {
    return (
      <MainCard>
        <CircularProgress />
      </MainCard>
    );
  }

  return (
    <MainCard>
      <Typography variant="h5">Callback Page</Typography>
    </MainCard>
  );
};

export default Callback;
