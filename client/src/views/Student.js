import React from "react";
import { useParams } from "react-router-dom";
import DetailsList from "../components/base/DetailList";
import TitleIcon from '@mui/icons-material/Title';
import SchoolIcon from '@mui/icons-material/School';
import EditDataDialog from "../components/dialogs/EditDataDialog";
import BreadCrumbBar from "../components/base/BreadCrumbCard";
// import MuiGrid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CollapseBox from "../components/base/CollapseBox";
import Grid from '@mui/material/Grid';
//import icons 
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import OutboxIcon from '@mui/icons-material/Outbox';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ScheduleIcon from '@mui/icons-material/Schedule';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

import { Divider, Typography } from "@mui/material";


import DetailsListVertical from "../components/base/DetailListVertical";
import { useSelector } from "react-redux";
import { setStudent, selectStudent } from "../slices/objectDataSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";


const Student = () => {
  // get student id (from url params which is a string)
  const { id } = useParams();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    const res = await axios.get("/student/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setStudent(res.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  const dataStudent = useSelector(selectStudent);

  const studentList = [];
  if (dataStudent) {
    studentList.push({ label: "Student First Name", value: dataStudent.firstName, icon: <PersonIcon /> });
    studentList.push({ label: "Student Second Name", value: dataStudent.name, icon: <PersonIcon /> });
    studentList.push({ label: "Student ID", value: dataStudent.id, icon: <Grid3x3Icon /> });
    studentList.push({ label: "Student Email", value: dataStudent.email, icon: <AlternateEmailIcon /> });

  } else {
    studentList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }


  const projectArray = dataStudent?.projects.length;

  const projectList = [];
  if (dataStudent && dataStudent.projects) {
    dataStudent.projects.map(project => [
      projectList.push([{ label: "Project Title", value: project.title, icon: <TitleIcon /> },
      { label: "Module Code", value: project.moduleCode, icon: <Grid3x3Icon /> },
      { label: "Module Year", value: project.moduleYear, icon: <CalendarMonthIcon /> }
      ])]);
  } else {
    projectList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }
  const projectNumber = Array.from({ length: projectArray });

  const lettersArray = dataStudent?.letters.length;

  const lettersList = [];
  if (dataStudent && dataStudent?.letters) {
    dataStudent.letters.map(letter => [
      lettersList.push([{ label: "Student Letter ID", value: letter.id, icon: <Grid3x3Icon /> },
      { label: "Student ID", value: letter.studentId, icon: <Grid3x3Icon /> },
      { label: "Student Letter Template ID", value: letter.templateId, icon: <Grid3x3Icon /> },
      { label: "Project ID", value: letter.projectId, icon: <Grid3x3Icon /> },
      { label: "Student Letter DocuSign ID", value: letter.docusignId, icon: <Grid3x3Icon /> },
      { label: "Student Letter Creation Date", value: letter.createdAt, icon: <ScheduleIcon /> },
      { label: "Student Letter Latest Update", value: letter.lastUpdated, icon: <UpgradeIcon /> },
      { label: "Student Letter Sent Date", value: letter.sentAt, icon: <OutboxIcon /> }
      ])]);
  } else {
    lettersList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }
  const signatureLetter = [];
  if (dataStudent) {
    dataStudent.letters.map(letter => [
      signatureLetter.push([{ label: "Student Letter Signature Status", value: letter.status, icon: <DonutLargeIcon /> },
      { label: "Student Letter Student Signature", value: letter.studentSigned, icon: <PersonIcon /> },
      { label: "Student Letter Univeristy Signature", value: letter.uniSigned, icon: <SchoolIcon /> }
      ])]);
  } else {
    signatureLetter.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }
  const letterNumber = Array.from({ length: lettersArray });

  return (
    <Grid container spacing={1} width="100%">
      <BreadCrumbBar title="Student" />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      ) : (

        <Grid item xs={12}>
          <EditDataDialog title="Edit Student" origObjectSelector={selectStudent} objectToEditType="student" objectSetter={setStudent} />
          <Typography variant="h4" mb={1}>Student Details</Typography>
          <Box display="flex" justifyContent="center">
            <Box
              sx={{
                width: '100%',
                p: 1,
                borderRadius: 2,
                mb: 1,
                bgcolor: '#e1f5fe',
                outline: '1px solid #b3e5fc',
              }}>
              <DetailsListVertical items={studentList} />
            </Box>
          </Box>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h5" mb={1}>Student Projects</Typography>
            {projectNumber.map((link, index) => (
              <CollapseBox
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  mb: 2,
                }}
                key={index}
                title={"Project " + dataStudent.projects[index].id}
                link={"/project/" + dataStudent.projects[index].id}
              >
                <DetailsList items={projectList[index]} />
              </CollapseBox>
            ))}

            <Divider sx={{ my: 1 }} />

            <Typography variant="h5" mb={1}>Student Letters</Typography>

            {letterNumber.map((link, index) => (
              <CollapseBox
                key={index}
                title={"Letter " + dataStudent?.letters[index].id}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  mb: 2,
                }} >


                <Box display="flex" flexDirection="row">
                  <Box
                    sx={{
                      mb: 1,
                    }}>
                    <DetailsListVertical items={lettersList[index]} />
                  </Box>
                </Box>

                <Box display="flex" flexDirection="row">
                  <Box
                    sx={{
                      mb: 1,
                    }}>
                    <DetailsListVertical items={signatureLetter[index]} />
                  </Box>
                </Box>
              </CollapseBox>
            ))}
          </Grid>
        </Grid>

      )
      }
    </Grid>
  )
}

export default Student;


