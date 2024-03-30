import React from "react";
import * as mui from "@mui/material";
import axios from "axios";

import MainCard from "../components/base/MainCard";
import UploadProjectsStepper from "../components/steppers/UploadProjectsStepper";

import { RequireAuth } from 'react-auth-kit'

const UploadProjects = () => {
  return (
    <RequireAuth loginPath="/login">
      <MainCard title="Upload Projects">
        <UploadProjectsStepper />
      </MainCard>
    </RequireAuth>
  )
}

export default UploadProjects;