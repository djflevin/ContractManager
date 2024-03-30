import React from "react";
import { useParams } from "react-router-dom";
import { setProject, selectProject, setStudent, selectStudent } from "../slices/objectDataSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
// import icons
import TitleIcon from '@mui/icons-material/Title';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DetailsListVertical from "../components/base/DetailListVertical";
import DetailsList from "../components/base/DetailList";
import PersonIcon from '@mui/icons-material/Person';
import EditDataDialog from "../components/dialogs/EditDataDialog";
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import BreadCrumbBar from "../components/base/BreadCrumbCard";

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Divider, Typography } from "@mui/material";
import CollapseBox from "../components/base/CollapseBox";



const Project = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);


  const fetchProject = async () => {
    const res = await axios.get("/project/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setProject(res.data));
      setLoading(false);
    }
  };

  const dataProject = useSelector(selectProject);


  // Call get_project_data() function on page load
  useEffect(() => {
    fetchProject();
  }, []);


  const projectList = [];
  if (dataProject) {
    projectList.push({ label: "Project Title", value: dataProject.title, icon: <TitleIcon /> });
    projectList.push({ label: "Module Code", value: dataProject.moduleCode, icon: <Grid3x3Icon /> });
    projectList.push({ label: "Module Year", value: dataProject.moduleYear, icon: <ScheduleIcon /> });
    projectList.push({ label: "Start Date", value: dataProject.startDate, icon: <CalendarMonthIcon /> });
    projectList.push({ label: "End Date", value: dataProject.endDate, icon: <CalendarMonthIcon /> });
  }
  else {
    projectList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }

  const uniInfo = [];
  if (dataProject) {
    uniInfo.push({ label: "University Supervisor", value: dataProject.uniSupervisor, icon: <SchoolIcon /> });
    uniInfo.push({ label: "University Supervisor Email", value: dataProject.uniSupervisorEmail, icon: <SchoolIcon /> });
    uniInfo.push({ label: "University Signatory Name", value: dataProject.uniSignatory, icon: <SchoolIcon /> });
    uniInfo.push({ label: "University Signatory Email", value: dataProject.uniSignatoryEmail, icon: <SchoolIcon /> });
    uniInfo.push({ label: "University Signatory Position", value: dataProject?.uniSignatoryPosition, icon: <SchoolIcon /> });
  } else {
    uniInfo.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }
  const industryInfo = [];
  if (dataProject) {
    industryInfo.push({ label: "Industry Supervisor", value: dataProject.isSupervisor, icon: <ApartmentIcon /> });
    industryInfo.push({ label: "Industry Supervisor Position", value: dataProject.isSupervisorPosition, icon: <ApartmentIcon /> });
    industryInfo.push({ label: "Industry Supervisor Email", value: dataProject.isSupervisorEmail, icon: <ApartmentIcon /> });
  } else {
    industryInfo.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }

  const studentArray = dataProject?.students.length

  const studentList = [];

  if (dataProject && dataProject.students) {
    dataProject.students.map(student => {
      studentList.push([
        { label: "Student Name", value: student.name, icon: <PersonIcon /> },
        { label: "Student ID", value: student.id, icon: <Grid3x3Icon /> },
        { label: "Student Email", value: student.email, icon: <AlternateEmailIcon /> }
      ])
    });
  } else {
    studentList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }


  const description = [];
  if (dataProject) {
    description.push({ label: "Project Title", value: dataProject.title, icon: <SchoolIcon /> });
    description.push({ label: "Project ID", value: dataProject.id, icon: <Grid3x3Icon /> });
    description.push({ label: "Project Description", value: dataProject.description, icon: <TextSnippetIcon /> });
  } else {
    description.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }


  const studentNumber = Array.from({ length: studentArray });

  return (
    <Grid container spacing={1} width="100%">
      <BreadCrumbBar />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      ) : (

        <Grid item xs={12}>
          <EditDataDialog title="Edit Project" origObjectSelector={selectProject} objectToEditType="project" objectSetter={setProject} />

          <Typography variant="h4" mb={1}>Project Details</Typography>
          <Box display="flex" flexDirection="row">
            <Box
              sx={{
                width: '100%',
                p: 1,
                borderRadius: 2,
                mb: 1,
                bgcolor: '#e1f5fe',
                outline: '1px solid #b3e5fc',
              }}>

              <DetailsListVertical items={projectList} />
            </Box>
          </Box>

          <Divider my={2} />

          <Grid item xs={12} my={2}>
            {/* Ensure Both Boxes are same height  */}
            <Box display="flex" flexDirection="row" height="100%">
              <Grid item xs={6} height="100%">
                <Typography variant="h6">Project Details - Univeristy</Typography>
                <Box
                  sx={{
                    width: '95%',
                    p: 1,
                    borderRadius: 2,
                    mr: 1,
                    bgcolor: '#e1f5fe',
                    outline: '1px solid #b3e5fc',
                    minHeight: '100%',
                  }}>
                  <DetailsListVertical items={uniInfo} />
                </Box>
              </Grid>

              <Grid item xs={6} height="100%">

                <Typography variant="h6">Project Details - Industry</Typography>
                {/* Ensure Box is the same height as parent Box */}
                <Box
                  sx={{
                    width: '100%',
                    p: 1,
                    borderRadius: 2,
                    bgcolor: '#e1f5fe',
                    outline: '1px solid #b3e5fc',
                    flexGrow: 1,
                  }}>
                  <DetailsList items={industryInfo} />
                </Box>
              </Grid>
            </Box>
          </Grid>



          <Grid item xs={12}>
            <Divider my={2} />

            <Typography variant="h5" my={2}>Project Description</Typography>
            <CollapseBox
              sx={{
                width: '100%',
                borderRadius: 1,
                mb: 2,
              }}
              title="Project Description"
            >
              <DetailsList items={description} />
            </CollapseBox>

            <Divider my={2} />
            <Typography variant="h5" my={2}>Project Groups</Typography>
            {studentNumber.map((link, index) => (
              <CollapseBox
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  mb: 2,
                }}
                key={index}
                title={"Student ID: " + dataProject.students[index].id}
                link={"/student/" + dataProject.students[index].id}  >
                <DetailsList items={studentList[index]} />
              </CollapseBox>
            ))}
          </Grid>
        </Grid>
      )
      }
    </Grid>
  )
}

export default Project;