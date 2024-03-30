import React from "react";

import ChildCard from "../components/base/ChildCard";

import { RequireAuth } from 'react-auth-kit'
import Link from 'react-router-dom';

import { useState } from "react";
import { useEffect } from "react";

import AdminOnlyWrapper from '../components/auth/AdminOnlyWrapper';

import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import {
  Box,
  Button,
  Grid,
  TextField,
  Chip,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import axios from 'axios';

// Fetches the contract templates from the server
const fetchContractTemplates = async (templateType) => {
  const res = await axios.get("/templates/" + templateType);
  // If the response is successful
  if (res.status === 200) {
    // Set the state with the data
    return res.data;
  } else {
    console.log("Error fetching contract templates");
    return [];
  }
};

const getAllContractTemplates = async () => {
  // Fetch the contract templates from the server
  const studentLetterTemplates = await fetchContractTemplates('student_letters');
  const projectDescriptionTemplates = await fetchContractTemplates('project_descriptions');
  const frameworkAgreementTemplates = await fetchContractTemplates('framework_agreements');

  return {
    studentLetterTemplates,
    projectDescriptionTemplates,
    frameworkAgreementTemplates,
  }
}

const TemplateListItem = (template, setShowEditForm, setTemplateToEdit, templatType, setTemplateToEditKey) => {

  return (
    <Box
      key={templatType + '_' + template.id}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        p: 2,
        border: 1,
        my: 1,
        borderColor: 'grey.500',
        borderRadius: 1,
      }}
    >
      <Chip
        key={templatType + '_' + template.id + '_name'}
        label={"Template: " + template.name}
        variant="outlined"
        sx={{ mr: 1, minWidth: 300 }} />

      <Chip
        key={templatType + '_' + template.id + '_docusignId'}
        label={"DocuSign ID: " + template.docusignId}
        variant="outlined"
        sx={{ mr: 1, minWidth: 200 }} />

      {/* If deafualt template, show chip  */}
      {template.isDefault ?
        <Chip
          key={templatType + '_' + template.id + '_default'}
          label={"Default Template"}
          variant="outlined"
        />
        : null}

      <Button
        key={templatType + '_' + template.id + '_view'}
        variant="contained"
        sx={{ ml: 'auto' }}
        onClick={() => {
          window.open(template.link, '_newtab');
        }}
        disabled={template.link === "" || template.link === undefined || template.link === null}
      >
        {template.link === "" || template.link === undefined || template.link === null ? "No Link" : "View Template"}
      </Button>

      <AdminOnlyWrapper>
        <Button variant="contained" sx={{ ml: 2 }}
          key={templatType + '_' + template.id + '_edit'}
          onClick={() => {
            setShowEditForm(true);
            setTemplateToEdit(template);
            setTemplateToEditKey(templatType + '_' + template.id);
          }}
        >
          Edit Template
        </Button>
      </AdminOnlyWrapper>
    </Box>
  )
}

const EditTemplateForm = ({ templateType, template, onClose, refetchData }) => {
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDocuSignID, setTemplateDocuSignID] = useState(template.docusignId);
  const [templateLink, setTemplateLink] = useState(template.link);
  const [templateIsDefault, setTemplateIsDefault] = useState(template.isDefault);

  const validateForm = () => {
    return (
      templateName !== null && templateName !== undefined && templateName !== "" &&
      templateDocuSignID !== null && templateDocuSignID !== undefined && templateDocuSignID !== ""
    );
  };


  const handleConfirmClick = async () => {
    const updatedTemplate = {
      name: templateName,
      docusignId: templateDocuSignID,
      link: templateLink,
      isDefault: templateIsDefault,
    };

    const res = await axios.put("/template/" + templateType + "/" + template.id, updatedTemplate);
    // If the response is successful
    if (res.status === 200) {
      // Close the form and reset the state
      onClose();
      setTemplateName("");
      setTemplateDocuSignID("");
      setTemplateLink("");
      setTemplateIsDefault(false);

      refetchData();

    } else {
      console.log("Error creating new template");
    }
  };

  const handleCancelClick = () => {
    onClose();
    setTemplateName("");
    setTemplateDocuSignID("");
    setTemplateLink("");
    setTemplateIsDefault(false);
  };

  return (
    <Box
      sx={{
        key: templateType + '_' + template.id,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        p: 2,
        border: 1,
        my: 1,
        borderColor: 'grey.500',
        borderRadius: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            key={templateType + '_' + template.id + '_name'}
            fullWidth
            label="Template Name"
            name="templateName"
            error={templateName === "" || templateName === undefined || templateName === null}
            onChange={(e) => setTemplateName(e.target.value)}
            required
            value={templateName}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            key={templateType + '_' + template.id + '_docusignId'}
            fullWidth
            label="DocuSign ID"
            name="templateDocuSignID"
            error={templateDocuSignID === "" || templateDocuSignID === undefined || templateDocuSignID === null}
            onChange={(e) => setTemplateDocuSignID(e.target.value)}
            required
            value={templateDocuSignID}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            key={templateType + '_' + template.id + '_link'}
            fullWidth
            label="DocuSign Link (Optional)"
            name="templateLink"
            onChange={(e) => setTemplateLink(e.target.value)}
            value={templateLink}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={3}>
          < FormControlLabel
            key={templateType + '_' + template.id + '_default'}
            control={<Checkbox
              checked={templateIsDefault}
              disabled={template.isDefault}
              onChange={(e) => setTemplateIsDefault(e.target.checked)} />
            }
            label="Default Template"
          />
        </Grid>
      </Grid>

      <Button variant="contained" sx={{ ml: 'auto' }}
        disabled={!validateForm()}
        onClick={handleConfirmClick}
        key={templateType + '_' + template.id + '_confirm'}
      >
        Confirm
      </Button>
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleCancelClick} key={templateType + '_' + template.id + '_cancel'}>
        Cancel
      </Button>
    </Box>
  )
}

const NewTemplateForm = ({ templateType, onClose, refetchData }) => {
  const [templateName, setTemplateName] = useState("");
  const [templateDocuSignID, setTemplateDocuSignID] = useState("");
  const [templateLink, setTemplateLink] = useState("");

  const validateForm = () => {
    return (
      templateName !== null && templateName !== undefined && templateName !== "" &&
      templateDocuSignID !== null && templateDocuSignID !== undefined && templateDocuSignID !== ""
    );
  };

  const handleConfirmClick = async () => {
    const newTemplate = {
      name: templateName,
      docusignId: templateDocuSignID,
      link: templateLink,
    };

    const res = await axios.post("/template/" + templateType, newTemplate);
    // If the response is successful
    if (res.status === 200) {
      // Close the form and reset the state
      onClose();
      setTemplateName("");
      setTemplateDocuSignID("");
      setTemplateLink("");

      refetchData();

    } else {
      console.log("Error creating new template");
    }
  };

  const handleCancelClick = () => {
    onClose();
    setTemplateName("");
    setTemplateDocuSignID("");
    setTemplateLink("");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        p: 2,
        border: 1,
        my: 1,
        borderColor: 'grey.500',
        borderRadius: 1,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1, minWidth: 240 }}>
            <TextField
              id="outlined-multiline-static"
              label="Template Name"
              multiline
              value={templateName}
              error={templateName === "" || templateName === undefined || templateName === null}
              onChange={(e) => setTemplateName(e.target.value)}
              variant="outlined"
            />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1, minWidth: 240 }}>
            <TextField
              id="outlined-basic"
              label="DocuSign Template ID"
              variant="outlined"
              value={templateDocuSignID}
              error={templateDocuSignID === "" || templateDocuSignID === undefined || templateDocuSignID === null}
              onChange={(e) => setTemplateDocuSignID(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1, minWidth: 240 }}>
            <TextField
              id="outlined-basic"
              label="DocuSign Template Link (Optional)"
              variant="outlined"
              value={templateLink}
              onChange={(e) => setTemplateLink(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="contained"
            disabled={!validateForm()}
            onClick={handleConfirmClick}>
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}



const ContractTemplates = () => {


  const [studentLetterTemplates, setStudentLetterTemplates] = useState([]);
  const [projectDescriptionTemplates, setProjectDescriptionTemplates] = useState([]);
  const [frameworkAgreementTemplates, setFrameworkAgreementTemplates] = useState([]);
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('');

  const handleDataRefresh = () => {
    getAllContractTemplates().then((data) => {
      setStudentLetterTemplates(data.studentLetterTemplates);
      setProjectDescriptionTemplates(data.projectDescriptionTemplates);
      setFrameworkAgreementTemplates(data.frameworkAgreementTemplates);
    });
  }

  useEffect(() => {
    getAllContractTemplates().then((data) => {
      setStudentLetterTemplates(data.studentLetterTemplates);
      setProjectDescriptionTemplates(data.projectDescriptionTemplates);
      setFrameworkAgreementTemplates(data.frameworkAgreementTemplates);
    });
  }, []);

  const handleNewTemplateClick = (templateType) => {
    setSelectedTemplateType(templateType);
    setShowNewTemplateForm(true);
  }

  const handleNewTemplateClose = () => {
    setShowNewTemplateForm(false);
  }

  return (
    <RequireAuth loginPath="/login">
      <ChildCard title="Student Letter Templates">
        {
          studentLetterTemplates.map((template) => {
            if (showEditForm && selectedTemplateKey === 'student_letter_' + template.id) {
              return <EditTemplateForm
                templateType="student_letter"
                template={template} onClose={() => setShowEditForm(false)}
                refetchData={handleDataRefresh} />
            } else {
              return TemplateListItem(template, setShowEditForm, setSelectedTemplate, 'student_letter', setSelectedTemplateKey);
            }
          })
        }

        {showNewTemplateForm && selectedTemplateType === 'student_letter' &&
          <NewTemplateForm
            templateType="student_letter"
            onClose={handleNewTemplateClose}
            refetchData={handleDataRefresh} />
        }
        <AdminOnlyWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton onClick={() => handleNewTemplateClick('student_letter')}>
              <Add />
            </IconButton>
          </Box>
        </AdminOnlyWrapper>
      </ChildCard>


      <ChildCard title="Project Description Templates">
        {
          projectDescriptionTemplates.map((template) => {
            if (showEditForm && selectedTemplateKey === 'project_description_' + template.id) {
              return <EditTemplateForm
                templateType="project_description"
                template={template} onClose={() => setShowEditForm(false)}
                refetchData={handleDataRefresh} />
            } else {
              return TemplateListItem(template, setShowEditForm, setSelectedTemplate, 'project_description', setSelectedTemplateKey);
            }
          })
        }
        {showNewTemplateForm && selectedTemplateType === 'project_description' &&
          <NewTemplateForm
            templateType="project_description"
            onClose={handleNewTemplateClose}
            refetchData={handleDataRefresh} />
        }
        <AdminOnlyWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton onClick={() => handleNewTemplateClick('project_description')}>
              <Add />
            </IconButton>
          </Box>
        </AdminOnlyWrapper>
      </ChildCard>
      <ChildCard title="Framework Agreement Templates">
        {
          frameworkAgreementTemplates.map((template) => {
            if (showEditForm && selectedTemplateKey === 'framework_agreement_' + template.id) {
              return <EditTemplateForm
                templateType="framework_agreement"
                template={template} onClose={() => setShowEditForm(false)}
                refetchData={handleDataRefresh} />
            } else {
              return TemplateListItem(template, setShowEditForm, setSelectedTemplate, 'framework_agreement', setSelectedTemplateKey);
            }
          })
        }
        {showNewTemplateForm && selectedTemplateType === 'framework_agreement' &&
          <NewTemplateForm
            templateType="framework_agreement"
            onClose={handleNewTemplateClose}
            refetchData={handleDataRefresh} />
        }
        <AdminOnlyWrapper>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <IconButton onClick={() => handleNewTemplateClick('framework_agreement')}>
              <Add />
            </IconButton>
          </Box>
        </AdminOnlyWrapper>
      </ChildCard>
    </RequireAuth>
  )
}


export default ContractTemplates;