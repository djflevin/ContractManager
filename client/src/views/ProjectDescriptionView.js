import React from "react";

import DataTableCard from "../components/cards/DataTableCard";

import utils from "../components/utils/DataTableUtils";

import { setProjectDescriptions , selectProjectDescriptions} from "../slices/contractSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RequireAuth } from 'react-auth-kit'

const ProjectDescriptionView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const projectDescriptions = useSelector(selectProjectDescriptions);

  const fetchProjectDescriptions = async () => {
    const res = await axios.get("/project_descriptions?page=" + page + "&limit=" + limit)
    if (res.status === 200) {
      // Set the state with the data
      const data = res.data;
      const formatted_data = utils.formatTableData(data, "project_description");
      dispatch(setProjectDescriptions(formatted_data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDescriptions();
  }, []);

  return (
    <RequireAuth loginPath="/login">
      <DataTableCard 
        title="Project Desciptions" 
        data={projectDescriptions}
        columns={utils.projectDescriptionDataColumns()}
        updateAll={fetchProjectDescriptions}
        type="project"
        />
    </RequireAuth>
  )
}

export default ProjectDescriptionView;