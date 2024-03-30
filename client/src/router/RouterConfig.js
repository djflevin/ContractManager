// Route configuration for the application 
// Define the routes and the layout links here 

import Layout from "../layouts/layout";
import Home from "../views/Home";
import ContractTemplates from "../views/ContractTemplates";
import Org from "../views/Org";
import Project from "../views/Project";
import ProjectView from "../views/ProjectView";
import Student from "../views/Student";
import UploadProjects from "../views/UploadProjects";
import FrameworkAgreementView from "../views/FrameworkAgreementView";
import StudentLetterView from "../views/StudentLetterView";
import ProjectDescriptionView from "../views/ProjectDescriptionView";
import StudentLetter from "../views/StudentLetter";
import ProjectDescription from "../views/ProjectDescription";
import Callback from "../views/Callback";
import Login from "../views/Login";

import {default as HomeIcon} from '@mui/icons-material/Home';
import Article from '@mui/icons-material/Article';
import Description from '@mui/icons-material/Description';
import HistoryEdu from '@mui/icons-material/HistoryEdu';
import AccountTree from '@mui/icons-material/AccountTree';
import Upload from '@mui/icons-material/Upload';

// Routes for the application (Rendered in the Layout component)
const layout_links = [
  { name: "Home", link: "/", icon: <HomeIcon /> },
  { name: "Student Letters", link: "/student-letter", icon: <Article /> },
  { name: "Project Descriptions", link: "/project-description", icon: <Description /> },
  { name: "Framework Agreements", link: "/framework-agreement", icon: <HistoryEdu /> },
  { name: "Project Overview", link: "/project", icon: <AccountTree /> },
  { name: "Upload Projects", link: "/upload-projects", icon: <Upload /> },
  { name: "Contract Templates", link: "/contract-templates", icon: <Description /> },
]

// Nested Routes including the Layout component
const routes = () => [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Home />
        ),
      },
      {
        path: "/contract-templates",
        element: (
          <ContractTemplates />
        ),
      },
      {
        path: "/org/:id",
        element: (
          <Org />
        ),
      },
      {
        path: "/project/:id",
        element: (
          <Project />
        ),
      },
      {
        path: "/project",
        element: (
          <ProjectView />
        ),
      },
      {
        path: "/student/:id",
        element: (
          <Student />
        ),
      },
      {
        path: "/upload-projects",
        element: (
          <UploadProjects />
        ),
      },
      {
        path: "/framework-agreement",
        element: (
          <FrameworkAgreementView />
        ),
      },
      {
        path: "/student-letter",
        element: (
          <StudentLetterView />
        ),
      },
      {
        path: "/project-description",
        element: (
          <ProjectDescriptionView />
        ),
      },
      {
        path: "/student-letter/:id",
        element: (
          <StudentLetter />
        ),
      },
      {
        path: "/project-description/:id",
        element: (
          <ProjectDescription />
        ),
      },
    ]
  },
  // Callback and Login Routes 
  {
    path: "/callback",
    element: (
      <Callback />
    ),
  },
  {
    path: "/login",
    element: (
      <Login />
    ),
  },
  // 404 Route 
  {
    path: "*",
    element: (
      <div>404</div>
    ),
  }
]



const router_config = {
  routes: routes(),
  layout_links: layout_links,
}

export default router_config;