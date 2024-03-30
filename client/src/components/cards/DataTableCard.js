import React from "react";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Inventory } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Snackbar from "@mui/material/Snackbar";

import MaterialReactTable from 'material-react-table';

import ChildCard from "../base/ChildCard";
import axios from "axios";
import { useState } from "react";
import { useAuthUser } from "react-auth-kit";

async function sendContractList(data) {
  let contract_type = data[0].contract_type;
  let contract_ids = [];
  data.map((contract) => {
    contract_ids.push(contract.id);
  });

  axios.post("/send/" + contract_type + "s", {
    contract_ids: contract_ids,
  });

  return true;
}

async function handleArchiveToggle(id, contractType, updateAll, archivedValue) {
  // Set the contract status to ARCHIVED 
  try {
    let res = await axios.post("/" + contractType + "/archive" + "/" + id, {
      archived: archivedValue,
    });
    if (res.status === 200 && res.data.success === true) {
      updateAll();
    } else {
      console.error("Error archiving contract");
    }
  } catch (error) {
    console.error(error);
  }
}

const SuccessSnackbar = ({ open, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Contracts have been initiated for sending, this may take a few minutes and the data will be updated once complete.
      </Alert>
    </Snackbar>
  );
}

const ErrorSnackbar = ({ open, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        Error sending contracts! Please contact the Admininstrator.
      </Alert>
    </Snackbar>
  );
}

const DataTableCard = ({ title, data, columns, type, updateAll, contractSetter }) => {
  const authUser = useAuthUser();
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  return (
    <ChildCard title={title} props={{ sx: { p: 0, m: 0 } }}>
      {/* Snackbars */}
      <SuccessSnackbar open={successSnackbarOpen} handleClose={() => setSuccessSnackbarOpen(false)} />
      <ErrorSnackbar open={errorSnackbarOpen} handleClose={() => setErrorSnackbarOpen(false)} />
      {
        authUser() && authUser().role !== "ADMIN" && (
          <Alert severity="warning">
            <AlertTitle>Contracts can only be sent by the IXN Staff</AlertTitle>
          </Alert>
        )
      }
      {/* Data Table */}
      <MaterialReactTable
        title={title}
        data={data}
        columns={columns}
        enableStickyHeader={true}
        enableRowSelection={(row) => row.original.status === "DRAFT"} // Only allow selection of DRAFT contracts
        enableGrouping={true}
        enableColumnActions={false}
        enableRowActions={true}
        enablePagination={true}
        enableGlobalFilterModes
        rowsPerPage={50}
        // enableColumnVirtualization={false}
        defaultColumn={{
          minSize: 10,
          maxSize: 450,
          size: 200,
        }}

        muiTableContainerProps={{ sx: { maxHeight: 'calc(80vh ) !important' } }}
        initialState={{
          density: 'compact',
          // columnFilters: [{id : 'status', value: 'SENT'}],
          showGlobalFilter: true,
          sorting: [{ id: 'status', desc: false }], // Sort by contract status by default
        }}

        positionGlobalFilter="right"
        muiSearchTextFieldProps={{
          placeholder: `Search ${data.length} rows`,
          sx: { minWidth: '300px' },
          variant: 'outlined',
        }}

        // Elevation Options
        muiTablePaperProps={{
          elevation: 0,
        }}

        // Toolbar options
        options={{
          // search: true,
          // paging: true,
          density: false,
          exportButton: true,
          grouping: true,
        }}

        muiTableHeadCellFilterTextFieldProps={{
          sx: { width: '100%' },
          variant: 'outlined',
        }}

        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Archive">
              <IconButton
                onClick={async () => {
                  // console.log(row.original);
                  await handleArchiveToggle(row.original.id,
                    row.original.contract_type,
                    updateAll,
                    !row.original.isArchived);
                }}
              >
                <Inventory />
              </IconButton>
            </Tooltip>
          </Box>
        )}


        renderTopToolbarCustomActions={({ table }) => {
          const handleSendSelectedContracts = async () => {
            const contractList = [];
            table.getSelectedRowModel().flatRows.map((row) => {
              if (row.original.status === "DRAFT") {
                contractList.push(row.original);
              }
            });

            let success = await sendContractList(contractList);
            console.log(success);
            if (success) {
              setSuccessSnackbarOpen(true);
              updateAll();
            }
          };

          const handleSendAllContracts = async () => {
            const contractList = data.filter((contract) => contract.status === "DRAFT");
            let success = await sendContractList(contractList);
            console.log(success);
            if (success) {
              setSuccessSnackbarOpen(true);
              updateAll();
            }
          };

          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                disabled={authUser().role !== "ADMIN"}
                color="error"
                variant="outlined"
                onClick={handleSendAllContracts}
              >
                Send all contracts
              </Button>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected() || (authUser() && authUser().role !== "ADMIN")}
                onClick={handleSendSelectedContracts}
                variant="outlined"
              >
                Send selected contracts
              </Button>
            </div>
          );
        }}
      />
    </ChildCard>
  );
}

export default DataTableCard;


