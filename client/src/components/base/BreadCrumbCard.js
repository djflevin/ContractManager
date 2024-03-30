import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CardContent, Breadcrumbs, Typography } from "@mui/material";

const BreadCrumbBar = ({ children }) => {
  // Route: /org/:id
  // Route: /project/:id
  // Get the entire route path
  const { id } = useParams();
  console.log("id: ", id);
  // Get path e.g. /org or /project
  const route = window.location.pathname.split("/")[1];

  console.log("route: ", route);

  return (
    <CardContent>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="/" color="inherit">
          <Typography color="primary">
            Home
          </Typography>
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/project"
        >
          <Typography color="primary">
            Project Overview
          </Typography>
        </Link>
        <Typography color="primary">
          {route} {id}
        </Typography>
      </Breadcrumbs>
    </CardContent >
  )
}

export default BreadCrumbBar;
