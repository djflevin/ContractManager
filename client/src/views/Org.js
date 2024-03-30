import React from "react";
import { useParams } from "react-router-dom";
import DetailsListVertical from "../components/base/DetailListVertical";
// icons import
import ApartmentIcon from '@mui/icons-material/Apartment';
import SchoolIcon from '@mui/icons-material/School';
import DetailsList from "../components/base/DetailList";
import TitleIcon from '@mui/icons-material/Title';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import EditDataDialog from "../components/dialogs/EditDataDialog";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CollapseBox from "../components/base/CollapseBox";
import { Divider, Typography } from "@mui/material";

import BreadCrumbBar from "../components/base/BreadCrumbCard";

// Display of a Single Organization (Org)
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setOrganisation, selectOrganisation, setFramework, selectFramework } from "../slices/objectDataSlice";
import { useSelector } from "react-redux";


const Org = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchOrg = async () => {
    const res = await axios.get("/organisation/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setOrganisation(res.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const dataOrganisation = useSelector(selectOrganisation);

  const orgList = [];
  if (dataOrganisation) {
    orgList.push({ label: "Organisation Code", value: dataOrganisation?.id, icon: <Grid3x3Icon /> });
    orgList.push({ label: "Organisation Name", value: dataOrganisation?.name, icon: <TitleIcon /> });
    orgList.push({ label: "Organisation Jursdiction", value: dataOrganisation?.jurisdiction, icon: <PublicIcon /> });
  } else {
    orgList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }

  const fetchFramework = async () => {
    const res = await axios.get("/framework_agreement/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setFramework(res.data));
      setLoading(false);
    }
  };

  const dataFramework = useSelector(selectFramework);

  // Call get_project_data() function on page load
  useEffect(() => {
    fetchFramework();
  }, []);

  const frameworkList = [];
  if (dataOrganisation) {
    frameworkList.push({ label: "Framework ID", value: dataOrganisation?.framework.id, icon: <Grid3x3Icon /> });
    frameworkList.push({ label: "DocuSign ID", value: dataOrganisation?.framework.docusignId, icon: <Grid3x3Icon /> });
    frameworkList.push({ label: "Organisation ID", value: dataOrganisation?.framework.organisationId, icon: <Grid3x3Icon /> });
    frameworkList.push({ label: "Framework Template ID", value: dataOrganisation?.framework.templateId, icon: <Grid3x3Icon /> });
    frameworkList.push({ label: "Framework Status", value: dataOrganisation?.framework.status, icon: <DonutLargeIcon /> });
    frameworkList.push({ label: "Framework Creation Date", value: dataOrganisation?.framework.createdAt, icon: <ScheduleIcon /> });
    frameworkList.push({ label: "Latest Update", value: dataOrganisation?.framework.lastUpdated, icon: <ScheduleIcon /> });
  } else {
    frameworkList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }
  const orgFramework = [];
  if (dataOrganisation) {
    orgFramework.push({ label: "Siganture Organisation", value: dataOrganisation?.framework.orgSignatory, icon: <ApartmentIcon /> });
    orgFramework.push({ label: "Sigantory Organisation Email", value: dataOrganisation?.framework.orgSignatoryEmail, icon: <ApartmentIcon /> });
    orgFramework.push({ label: "Sigantory Organisation Position", value: dataOrganisation?.framework.orgSignatoryPosition, icon: <ApartmentIcon /> });
    orgFramework.push({ label: "Sigantory Organisation Status", value: dataOrganisation?.framework.orgSigned, icon: <ApartmentIcon /> });
  } else {
    orgFramework.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }

  const uniFramework = [];
  if (dataOrganisation) {
    uniFramework.push({ label: "Siganture University", value: dataOrganisation?.framework.uniSignatory, icon: <SchoolIcon /> });
    uniFramework.push({ label: "Siganture University Email", value: dataOrganisation?.framework.uniSignatoryEmail, icon: <SchoolIcon /> });
    uniFramework.push({ label: "Siganture University Position", value: dataOrganisation?.framework.uniSignatoryPosition, icon: <SchoolIcon /> });
    uniFramework.push({ label: "Siganture University Status", value: dataOrganisation?.framework.uniSigned, icon: <SchoolIcon /> });
  } else {
    uniFramework.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }


  const projectArray = dataOrganisation?.projects.length
  const projectList = [];
  if (dataOrganisation && dataOrganisation.projects) {
    dataOrganisation.projects.map(project => [
      projectList.push([{ label: "Project Title", value: project.title, icon: <TitleIcon /> },
      { label: "Module Code", value: project.moduleCode, icon: <Grid3x3Icon /> },
      { label: "Module Year", value: project.moduleYear, icon: <CalendarMonthIcon /> }
      ])])
  } else {
    projectList.push({ label: "No data", value: "", icon: <TextSnippetIcon /> });
  }

  const projectNumber = Array.from({ length: projectArray });

  return (
    <Grid container spacing={2} width="100%">
      <BreadCrumbBar />
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading..</span>
          </div>
        </div>
      ) : (

        <Grid item xs={12}>

          <EditDataDialog title="Edit Organisation" origObjectSelector={selectOrganisation} objectToEditType="organisation" objectSetter={setOrganisation} />

          <Typography variant="h4" my={2}>Organisation Details</Typography>
          <Box display="flex" flexDirection="row" >
            <Box
              sx={{
                width: '100%',
                p: 1,
                borderRadius: 2,
                mb: 1,
                bgcolor: '#e1f5fe',
                outline: '1px solid #b3e5fc',
              }}>
              <DetailsListVertical items={orgList} />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="h5" my={2}>Framework Details</Typography>


            <CollapseBox title={"Framework Details"}
              sx={{
                width: '100%',
                borderRadius: 1,
                mb: 2,
              }} >
              <Box display="flex" flexDirection="row">
                <Box
                  sx={{
                    width: 910,
                    mb: 1
                  }}>
                  <DetailsListVertical
                    items={frameworkList} />
                </Box>
              </Box>

              <Box display="flex" flexDirection="row">
                <Box
                  sx={{
                    width: 446,
                    mb: 1
                  }}>
                  <DetailsList
                    items={orgFramework} />
                </Box>
                <Box
                  sx={{
                    mb: 1
                  }}>
                  <DetailsList
                    items={uniFramework} />
                </Box>
              </Box>
            </CollapseBox>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" my={2}>Organisation Projects</Typography>
          <Grid item xs={12}>
            {projectNumber.map((link, index) => (
              <CollapseBox
                key={index}
                link={"/project/" + dataOrganisation?.projects[index].id}
                title={"Project ID: " + dataOrganisation?.projects[index].id}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  mb: 2,
                }} >
                <DetailsList items={projectList[index]} />
              </CollapseBox>
            ))}
          </Grid>
        </Grid>
      )
      }
    </Grid>
  )
}

export default Org;

