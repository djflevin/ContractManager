import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Axios from "axios";
import router_config from "./router/RouterConfig";
import { AuthProvider } from 'react-auth-kit'

// Axios Base URL for future requests
Axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";


// Create the router 
const router = createBrowserRouter(
  router_config.routes
);

const App = () => {
  return (
    // AuthProvider is used to handle authentication and authorization 
    // AuthProvider is a wrapper for the RouterProvider to ensure that the router is only loaded after authentication is complete
    <AuthProvider 
      authType="cookie"
      authName="_auth" 
      >
      <RouterProvider router={router}> 
      </RouterProvider>
    </AuthProvider>
  )
}

export default App;
