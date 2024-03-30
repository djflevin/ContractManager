import React from "react";

import DataTableCard from "../components/cards/DataTableCard";

import utils from "../components/utils/DataTableUtils";
import { RequireAuth } from 'react-auth-kit'

import { setStudentLetters, selectStudentLetters } from "../slices/contractSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";

const StudentLetterView = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const studentLetters = useSelector(selectStudentLetters);

  const fetchStudentLetters = async () => {
    const res = await axios.get("/student_letters?page=" + page + "&limit=" + limit)
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data
      let data = res.data;
      let formatted_data = utils.formatTableData(data, "student_letter");
      dispatch(setStudentLetters(formatted_data));
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch Data
    fetchStudentLetters();
  }, []);

  return (
    <RequireAuth loginPath="/login">
      <DataTableCard
        title="Student Letter Contracts"
        data={studentLetters}
        updateAll={fetchStudentLetters}
        columns={utils.studentLetterDataColumns()}
        type="student"
      />
    </RequireAuth>
  )
}

export default StudentLetterView;