import React from "react";

import DataTableCard from "../components/cards/DataTableCard";

import utils from "../components/utils/DataTableUtils";

import { RequireAuth } from 'react-auth-kit'

import { setFrameworkAgreements, selectFrameworkAgreements } from "../slices/contractSlice";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";


const FrameworkAgreementView = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(500);
  const [loading, setLoading] = useState(false);
  const frameworkAgreements = useSelector(selectFrameworkAgreements);

  const fetchFrameworkAgreements = async () => {
    const res = await axios.get("/framework_agreements" + "?page=" + page + "&limit=" + limit)
    // If the response is successful
    if (res.status === 200) {
      // Set the state with the data      
      let data = res.data;
      let formatted_data = utils.formatTableData(data, "framework_agreement");
      dispatch(setFrameworkAgreements(formatted_data));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFrameworkAgreements();
  }, []);

  return (
    <RequireAuth loginPath="/login">
      <DataTableCard
        title="Framework Contracts"
        data={frameworkAgreements}
        updateAll={fetchFrameworkAgreements}
        columns={utils.frameworkAgreementDataColumns()}
        type="org"
      />
    </RequireAuth>
  )
}

export default FrameworkAgreementView;