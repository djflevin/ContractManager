import React from "react";
import { Fab, Alert } from "@mui/material";
import { Download } from "@mui/icons-material";
import ProjectTableCard from "../components/cards/ProjectTableCard";

import utils from "../components/utils/DataTableUtils";

import { RequireAuth } from 'react-auth-kit'

import { setProjectList } from "../slices/objectDataSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectProjectList } from "../slices/objectDataSlice";
import AdminOnlyWrapper from '../components/auth/AdminOnlyWrapper';

// Function to download all projects as a CSV file 
const downloadAsCSV = async () => {
  const res = await axios.get("/projects/download");
  // If the response is successful
  if (res.status === 200) {
    // Set the state with the data
    const csvData = res.data;
    // Create a link to download the file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([csvData], { type: 'text/csv' }));
    link.setAttribute('download', 'projects.csv');
    document.body.appendChild(link);
    link.click();
  }
};


const ProjectView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchProjects = async () => {
    const res = await axios.get("/projects?page=" + page + "&limit=" + limit);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      const data = res.data;
      const formatted_data = utils.formatProjectOverviewData(data);
      dispatch(setProjectList(formatted_data));
      setLoading(false);
    }
  };

  const projectList = useSelector(selectProjectList);
  useEffect(() => {
    fetchProjects();
  }, []);



  return (
    <RequireAuth loginPath="/login">
      <Alert severity="info"> Overview of all projects, students and organisations. Click on a object to view more details. </Alert>

      <AdminOnlyWrapper>
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={downloadAsCSV}>
          Download as CSV
          <Download
            style={{ marginLeft: "10px" }} />
        </Fab>
      </AdminOnlyWrapper>


      <ProjectTableCard
        title="Projects"
        data={projectList}
        columns={utils.projectOverviewDataColumns()}
        type="project"
        initalGroupBy="project.id"
      />
    </RequireAuth>
  )
}

export default ProjectView;