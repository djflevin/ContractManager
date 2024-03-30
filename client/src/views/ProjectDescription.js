import React from "react";
import { setProjectDescription } from "../slices/contractSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
// Disiplay of a Student details

const ProjectDescription = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchProjectDescription = async () => {

    const res = await axios.get("/project_description/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setProjectDescription(res.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDescription();
  }, []);

  // return (
  //   <ProjectDescriptionDetails/>
  // )
}

export default ProjectDescription;