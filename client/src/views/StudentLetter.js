import React from "react";
// import StudentLetterDetails from "../components/cards/StudentLetterDetails";

// Disiplay of a Student details
import { RequireAuth } from 'react-auth-kit'

import { setStudentLetter } from "../slices/contractSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";

const StudentLetter = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  const fetchStudentLetter = async () => {
    const res = await axios.get("/student_letter/" + id);
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      dispatch(setStudentLetter(res.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentLetter();
  }, []);

  // return (
  //   // <StudentLetterDetails/>
  // )
}

export default StudentLetter;