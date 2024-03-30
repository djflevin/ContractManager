import {
  Link,
} from "react-router-dom";
import { Box, Button, Chip, Grid } from "@mui/material";
import { Close, Check, Drafts, Send, PlayArrow, Pause, Help, Person, Business, Book, FileOpen, Article, Archive } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Utils to get theme 
const GetTheme = () => {
  return useTheme();
};

const iconMap = {
  false: <Close />,
  true: <Check />,
  "draft": <Drafts />,
  "sent": <Send />,
  "signed": <Check />,
  "active": <PlayArrow />,
  "inactive": <Pause />,
  "link": <Link />,
  "default": <Help />, // "default" is a reserved word in JS, so we can't use it as a key
  "student": <Person />,
  "supervisor": <Person />,
  "organisation": <Business />,
  "project": <Book />,
  "template": <FileOpen />,
  "contract": <Article />,
  "org": <Business />,
  "archived": <Archive />,
};

const colourMap = (theme) => ({
  false: theme.palette.error.main,
  true: theme.palette.success.main,
  "draft": theme.palette.warning.main,
  "sent": theme.palette.success.main,
  "signed": theme.palette.success.main,
  "active": theme.palette.success.main,
  "inactive": theme.palette.error.main,
  "link": theme.palette.info.main,
  "template": theme.palette.info.main,
  "default": theme.palette.grey[500],
  "archived": theme.palette.grey[500],
});

const nameColorMap = () => ({
  false: "error",
  true: "success",
  "draft": "warning",
  "sent": "success",
  "signed": "success",
  "active": "success",
  "inactive": "error",
  "link": "info",
  "template": "info",
  "default": "primary",
  "archived": "info",
});

const getIcon = (value, map) => {
  const mapKey = typeof value === 'string' ? value.toLowerCase() : value;
  return mapKey in map ? map[mapKey] : map['default'];
};

const getColor = (value, map) => {
  const mapKey = typeof value === 'string' ? value.toLowerCase() : value;
  return mapKey in map ? map[mapKey] : map['default'];
};

const IconCellFormatting = ({ cell }) => {
  return (
    <Box
    // Rewrite this to use the colourMap and Dispaly the correct Icon
    >
      {
        <Chip
          label={cell.getValue()}
          icon={getIcon(cell.getValue(), iconMap)}
          sx={(theme) => ({
            // Full width
            ml: 0,
            color: '#fff',
            backgroundColor: getColor(cell.getValue(), colourMap(theme)),
          })}
          size="small"
        />
      }
    </Box>
  );
}

const IconOnlyCellFormatting = ({ cell }) => {
  return (
    <Box
    >
      {
        <Chip
          icon={getIcon(cell.getValue(), iconMap)}
          color={getColor(cell.getValue(), nameColorMap())}
          variant="outlined"
          size="small"
          sx={{ pl: 1, pr: 0 }}
        />
      }
    </Box>
  );
}

const MiniIconCellFormatting = ({ cell }) => {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        width: "100%",
      })}
    >
      {
        <Chip
          label={cell.getValue()}
          icon={getIcon(cell.getValue(), iconMap)}
          color={getColor(cell.getValue(), nameColorMap())}
          variant="outlined"
          backgroundcolor={getColor(cell.getValue(), colourMap(GetTheme()))}
          size="small"
          sx={{ pl: 1, pr: 0, minWidth: 100 }}
        />
      }
    </Box>
  );
}

const LinkCellFormatting = ({ cell, label }) => {
  return (
    <Box
      component="span"
      sx={(theme) => ({
        width: "100%",
      })}
    >
      {
        <Chip
          label={label ? label : "View"}
          icon={getIcon("contract", iconMap)}
          // color={getColor("link", nameColorMap())}
          variant="outlined"
          onClick={() => window.open(cell.getValue(), "_blank")}
          color={getColor("link", nameColorMap())}
          size="small"
        />
      }
    </Box>
  );
}

const InternalLinkCellFormatting = ({ cell, label, link, icon, color }) => {
  return (
    <Link to={link} sx={(theme) => ({
    })}>
      {
        icon ?
          <Chip
            label={label ? label : cell.getValue()}
            variant="outlined"
            icon={getIcon(icon ? icon : "link", iconMap)}
            color={getColor(color ? color : "link", nameColorMap())}
            size="small"
          />
          :
          <Chip
            label={label ? label : cell.getValue()}
            variant="outlined"
            color={getColor(color ? color : "link", nameColorMap())}
            size="small"
          />
      }

    </Link>
  );
}

const doubleSignaturesCellFormatting = ({ cell }) => {
  return (
    <Box
      component="span"
    >
      <Grid
        container
        direction="row"
        maxWidth="100%"
      >
        <Grid item>
          {
            <Chip
              label={cell.getValue().label_1}
              icon={getIcon(cell.getValue().signed_1, iconMap)}
              color={getColor(cell.getValue().signed_1, nameColorMap())}
              variant="outlined"
              // Margin right
              sx={(theme) => ({
                marginRight: theme.spacing(1),
                maxWidth: 200,
              })}
              size="small"
            />
          }
        </Grid>
        <Grid item>       {/* Fill up space to push chip to the right */}
          {
            <Chip
              label={cell.getValue().label_2}
              icon={getIcon(cell.getValue().signed_2, iconMap)}
              color={getColor(cell.getValue().signed_2, nameColorMap())}
              variant="outlined"
              size="small"
              sx={(theme) => ({
                maxWidth: 200,
              })}
            />
          }
        </Grid>
      </Grid>
    </Box>
  );
}

const doubleLinksCellFormatting = ({ cell }) => {
  const link1 = cell.getValue().link1;
  const link2 = cell.getValue().link2;

  return (
    <Box>
      <Chip
        label="Template"
        icon={getIcon("template", iconMap)}
        color={link1 ? getColor("template", nameColorMap()) : "default"}
        variant="outlined"
        onClick={() => {
          if (link1 && link1 !== "") {
            window.open(link1, "_new");
          }
        }}
        sx={(theme) => ({
          marginRight: theme.spacing(1),
          ...(link1 === null || link1 === "" ? { backgroundColor: theme.palette.grey[300], borderColor: theme.palette.grey[300] } : {}),
        })}
        size="small"
        disabled={!link1 || link1 === ""}
      />
      <Chip
        label="Contract"
        icon={getIcon("contract", iconMap)}
        color={link2 ? getColor("default", nameColorMap()) : "default"}
        variant="outlined"
        onClick={() => {
          if (link2 && link2 !== "") {
            window.open(link2, "_new");
          }
        }}
        sx={(theme) => (link2 === null || link2 === "" ? { backgroundColor: theme.palette.grey[300], borderColor: theme.palette.grey[300] } : {})}
        size="small"
        disabled={!link2 || link2 === ""}
      />
    </Box>
  );
};


const multiLinksCellFormatting = ({ cell, links }) => {
  // Formatting for cell that between 1 and 3 links to internal pages
  // Links in format {label: "label", link: "/link", icon: "icon"}
  return (
    <Box>
      {
        links.map((link) => {
          return (
            <Link to={link.link} sx={(theme) => ({
            })}>
              {
                link.icon ?
                  <Button
                    variant="outlined"
                    startIcon={getIcon(link.icon, iconMap)}
                    color={getColor("default", nameColorMap())}
                    size="small"
                    disabled={link.link === ""}
                    sx={(theme) => ({
                      marginRight: theme.spacing(1),
                    })}
                  > {link.label} </Button>
                  :
                  <Button
                    variant="outlined"
                    color={getColor("default", nameColorMap())}
                    size="small"
                    disabled={link.link === ""}
                  > {link.label} </Button>
              }
            </Link>
          )
        })
      }
    </Box>
  );
}

const formatTableData = (data, contract_type) => {
  // Format data into more desirable format for table
  // This is a bit of a hacky solution, but it works for now
  const formattedData = data.map((row) => {
    if (contract_type === "project_description") {
      row.signatures = {
        signed_1: row.uniSigned,
        signed_2: row.orgSigned,
        label_1: "UCL",
        label_2: "ORG"
      }

      row.entity_links = [
        { label: 'Project', link: '/project/' + row.project.id, icon: 'project' },
        { label: 'Organisation', link: '/org/' + row.project.organisation.id, icon: 'organisation' },
      ]
    } else if (contract_type === "framework_agreement") {
      row.signatures = {
        signed_1: row.uniSigned,
        signed_2: row.orgSigned,
        label_1: "UCL",
        label_2: "ORG"
      }

      row.entity_links = [
        { label: 'Organisation', link: '/org/' + row.organisation.id, icon: 'organisation' },
      ]
    } else if (contract_type === "student_letter") {
      row.signatures = {
        signed_1: row.uniSigned,
        signed_2: row.studentSigned,
        label_1: "UCL",
        label_2: "Student"
      }

      row.entity_links = [
        { label: 'Project', link: '/project/' + row.project.id, icon: 'project' },
        { label: 'Student', link: '/student/' + row.student.id, icon: 'student' },
        { label: 'Organisation', link: '/org/' + row.project.organisation.id, icon: 'organisation' },
      ]
    }

    row.contract_type = contract_type;
    // Combine Template link and Contract link into one column

    row.links = {
      link1: row.template.link,
      link2: row.link,
      label1: "Template",
      label2: "Contract",
    }

    if (contract_type === "project_description" || contract_type === "student_letter") {
      // Short form of the Project ID and Title 
      row.short_title = row.project.title.substring(0, 20) + "...";
    }

    // If the contract is Archived, then then override the status to be "Archived"
    if (row.isArchived) {
      row.status = "ARCHIVED";
    }

    return row;


  });
  return formattedData;
}

const projectDescriptionDataColumns = () => [
  {
    header: "Status", accessorKey: "project.status", size: 110,
    Cell: ({ cell }) => (IconOnlyCellFormatting({ cell })),
    filterVariant: 'multi-select',
    filterSelectOptions: ["ACTIVE", "INACTIVE"]
  },
  {
    header: "Contract", accessorKey: "status", size: 130,
    Cell: ({ cell }) => (MiniIconCellFormatting({ cell })),
    filterVariant: 'multi-select',
    filterSelectOptions: ["ARCHIVED", "DRAFT", "SENT", "SIGNED"],
  },
  { header: "Project", accessorKey: "short_title", },
  {
    header: "Signed By ( Uni - Org )", accessorKey: "signatures",
    Cell: ({ cell }) => (doubleSignaturesCellFormatting({ cell })),
    enableGrouping: false
  },
  { header: "Organisation", accessorKey: "project.organisation.name", },
  { header: "Programme", accessorKey: "project.programme.code", size: 130 },
  {
    header: "Document Links", accessorKey: "links",
    Cell: ({ cell }) => (doubleLinksCellFormatting({ cell })), enableColumnFilter: false,
    enableGrouping: false, enableSorting: false
  },
  {
    header: "Entity Links", accessorKey: "entity_links", enableColumnFilter: false,
    Cell: ({ cell }) => (multiLinksCellFormatting({ cell, links: cell.getValue() }))
  },
]

const studentLetterDataColumns = () => [
  {
    header: "Status", accessorKey: "project.status", size: 110,
    Cell: ({ cell }) => (IconOnlyCellFormatting({ cell })),
    filterVariant: 'multi-select',
    filterSelectOptions: ["ACTIVE", "INACTIVE"]
  },
  {
    header: "Contract", accessorKey: "status", size: 130,
    Cell: ({ cell }) => (MiniIconCellFormatting({ cell })),
    filterVariant: 'multi-select',
    filterSelectOptions: ["ARCHIVED", "DRAFT", "SENT", "SIGNED"],
  },
  { header: "Project", accessorKey: "short_title", },
  {
    header: "Signed By", accessorKey: "signatures",
    Cell: ({ cell }) => (doubleSignaturesCellFormatting({ cell })),
    enableGrouping: false,
    enableColumnFilter: false
  },
  { header: "Student ID", accessorKey: "student.id" },
  { header: "Organisation", accessorKey: "project.organisation.name", },
  { header: "Programme", accessorKey: "project.programme.code", size: 130 },
  {
    header: "Document Links", accessorKey: "links",
    Cell: ({ cell }) => (doubleLinksCellFormatting({ cell })),
    enableGrouping: false, enableSorting: false, enableColumnFilter: false
  },
  {
    header: "Entity Links", accessorKey: "entity_links",
    Cell: ({ cell }) => (multiLinksCellFormatting({ cell, links: cell.getValue() })),
    enableGrouping: false, enableSorting: false, enableColumnFilter: false
  },
]

const frameworkAgreementDataColumns = () => [
  {
    header: "Contract", accessorKey: "status", size: 110,
    Cell: ({ cell }) => (MiniIconCellFormatting({ cell })),
    filterVariant: 'multi-select',
    filterSelectOptions: ["ARCHIVED", "DRAFT", "SENT", "SIGNED"],
  },
  { header: "Organisation", accessorKey: "organisation.name", },
  {
    header: "Signed By", accessorKey: "signatures",
    Cell: ({ cell }) => (doubleSignaturesCellFormatting({ cell })),
    enableGrouping: false, enableColumnFilter: false
  },
  {
    header: "Document Links", accessorKey: "links",
    Cell: ({ cell }) => (doubleLinksCellFormatting({ cell })),
    enableGrouping: false, enableSorting: false,
    enableColumnFilter: false
  },
  {
    header: "Entity Links", accessorKey: "entity_links",
    Cell: ({ cell }) => (multiLinksCellFormatting({ cell, links: cell.getValue() })),
    enableGrouping: false, enableSorting: false, enableColumnFilter: false
  }
]

const formatProjectOverviewData = (data) => {
  // Format data into more desirable format for table
  // This is a bit of a hacky solution, but it works for now
  // At the moment, project overview returns a students: [] array. We need to flatten this and create a new row for each student
  const formattedData = []
  data.forEach((row) => {
    row.students.forEach((student) => {
      // Copy the row and add the student data
      const newRow = { ...row, student: student }
      formattedData.push(newRow)
    })
  });
  return formattedData;
}

const projectOverviewDataColumns = () => [
  {
    header: "Status", accessorKey: "status", size: 110,
    Cell: ({ cell }) => (IconOnlyCellFormatting({ cell }))
  },
  {
    header: "Project", accessorKey: "title",
    Cell: ({ cell }) => (InternalLinkCellFormatting({ cell, link: "/project/" + cell.row.original.id, icon: "project" }))
  },
  {
    header: "Student", accessorKey: "student.name",
    Cell: ({ cell }) => (InternalLinkCellFormatting({ cell, link: "/student/" + cell.row.original.student.id, icon: "student" }))
  },
  {
    header: "Organisation", accessorKey: "organisation.name",
    Cell: ({ cell }) => (InternalLinkCellFormatting({ cell, link: "/org/" + cell.row.original.organisation.id, icon: "organisation" }))
  },
  { header: "Supervisor", accessorKey: "uniSupervisor" }
]


const utils = {
  IconCellFormatting,
  LinkCellFormatting,
  MiniIconCellFormatting,
  InternalLinkCellFormatting,
  projectDescriptionDataColumns,
  studentLetterDataColumns,
  frameworkAgreementDataColumns,
  formatTableData,
  formatProjectOverviewData,
  projectOverviewDataColumns,
};

export default utils;
