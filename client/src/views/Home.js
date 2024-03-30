import React from "react";
import Select from "@mui/material/Select";

import MainCard from "../components/base/MainCard";
import Grid from '@mui/material/Grid';
import PieChart from '../components/charts/PieChart';
import BarChart from "../components/charts/BarChart";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';

import { RequireAuth } from 'react-auth-kit'

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import { formatContractPieChart, formatProgrammeContractBarChart } from '../components/utils/Charts';

const Home = () => {
  const [timeFrame, setTimeFrame] = useState("all");
  const [projectStatus, setProjectStatus] = useState("all");
  const [programme, setProgramme] = useState("all");
  const [programmeList, setProgrammeList] = useState([]);

  const [frameworkPieChartData, setFrameworkPieChartData] = useState([]);
  const [projectDescriptionPieChartData, setProjectDescriptionPieChartData] = useState([]);
  const [studentLetterPieChartData, setStudentLetterPieChartData] = useState([]);
  const [studentLetterBarChartData, setStudentLetterBarChartData] = useState([]);
  const [projectDescriptionBarChartData, setProjectDescriptionBarChartData] = useState([]);

  const fetchAnalytics = async () => {
    const route = "/data/contracts" + "?timeFrame=" + timeFrame + "&projectStatus=" + projectStatus + "&programme=" + programme;
    const res = await axios.get(route);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      setFrameworkPieChartData(formatContractPieChart(res.data.frameworkAgreements));
      setProjectDescriptionPieChartData(formatContractPieChart(res.data.projectDescriptions));
      setStudentLetterPieChartData(formatContractPieChart(res.data.studentLetters));

      setStudentLetterBarChartData(formatProgrammeContractBarChart(res.data.studentLetters));
      setProjectDescriptionBarChartData(formatProgrammeContractBarChart(res.data.projectDescriptions));
    }
  };

  const fetchProgrammes = async () => {
    const res = await axios.get("/programmes");
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      setProgrammeList(res.data);
    }
  };

  useEffect(() => {
    fetchProgrammes();
    fetchAnalytics();
  }, []);

  return (
    <RequireAuth loginPath="/login">
      {/* Filter Buttons */}
      <Grid container spacing={2} style={{ marginBottom: 10 }}>
        <Grid item xs={12} md={6} lg={3}>
          {/* Select Time Frame (Start Date) */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="timeFrame">Time Frame</InputLabel>
            <Select fullWidth value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)} label="Time Frame" variant="outlined">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="nextYear">Next Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Select Project Status */}
        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="projectStatus">Project Status</InputLabel>
            <Select fullWidth value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)} label="Project Status" variant="outlined">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          {/* Select Programme */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="programme">Programme</InputLabel>
            <Select fullWidth value={programme} onChange={(e) => setProgramme(e.target.value)}
              label="Programme" variant="outlined" id="programme">
              <MenuItem value="all">All</MenuItem>
              {programmeList.map((programme) => (
                <MenuItem value={programme.id}>{programme.code}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          {/* Button full Height as other grids */}
          <Button fullWidth variant="outlined" onClick={fetchAnalytics} style={{ height: "100%" }}>Update Filter</Button>
        </Grid>
      </Grid>


      {/* Pie Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          {/* Number of Project Descriptons */}
          {/* If projectDescriptionPieChartData.total is undefined, display "Loading..." */}
          <MainCard title={"Project Descriptions - " + (projectDescriptionPieChartData.total ? projectDescriptionPieChartData.total : "Loading...")}
          >
            <PieChart series={projectDescriptionPieChartData.series} labels={projectDescriptionPieChartData.labels} />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MainCard title={"Student Letters - " + (studentLetterPieChartData.total ? studentLetterPieChartData.total : "Loading...")}>
            <PieChart series={studentLetterPieChartData.series} labels={studentLetterPieChartData.labels} />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <MainCard title={"Framework Agreements - " + (frameworkPieChartData.total ? frameworkPieChartData.total : "Loading...")}>
            <PieChart series={frameworkPieChartData.series} labels={frameworkPieChartData.labels} />
          </MainCard>
        </Grid>
      </Grid>

      {/* Bar Charts */}
      <Grid container spacing={2} style={{ marginTop: 5 }}>
        <Grid item xs={12} md={12} lg={6}>
          <MainCard title="Project Descriptions per Module">
            <BarChart
              width={'100%'}
              height={300}
              categories={projectDescriptionBarChartData.categories}
              series={projectDescriptionBarChartData.series} />
          </MainCard>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <MainCard title="Student Letters per Module">
            <BarChart
              width={'100%'}
              height={300}
              categories={studentLetterBarChartData.categories}
              series={studentLetterBarChartData.series} />
          </MainCard>
        </Grid>
      </Grid>
    </RequireAuth>
  )
}

export default Home;






