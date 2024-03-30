import React from "react";

import MaterialReactTable from 'material-react-table';

import ChildCard from "../base/ChildCard";

const ProjectTableCard = ({ title, data, columns, type }) => {

  return (
    <ChildCard title={title}>
      {/* Data Table */}
      <MaterialReactTable
        title={title}
        enableExpanding={true}
        data={data}
        columns={columns}
        enableStickyHeader={true}
        enableGrouping={true}
        enableGlobalFilterModes
        initialState={{
          density: 'compact',
          showGlobalFilter: true,
        }}
        muiTablePaginationProps={{
          rowsPerPageOptions: [10, 25, 50, 100],
        }}

        // Elevation OPtions
        muiTablePaperProps={{
          elevation: 0,
        }}

        positionGlobalFilter="left"
        muiSearchTextFieldProps={{
          placeholder: `Search ${data.length} rows`,
          sx: { minWidth: '300px' },
          variant: 'outlined',
        }}


        // Toolbar options
        options={{
          search: true,
          paging: true,
          // filtering: true,
          exportButton: true,
          grouping: true,
          rowStyle: {
            backgroundcolor: '#EEE',
          },
        }}
      />
    </ChildCard>
  );
}

export default ProjectTableCard;


