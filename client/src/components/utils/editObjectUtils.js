// Data Fetching Utils 
// Fetch Contract Templates
import {
  Box,
  TextField, 
  MenuItem, 
  Typography, 
  Divider, 
  Grid,
  Chip,
  Select,
} from '@mui/material';

// Editing Functionalities required:
// 1. Assigning templates to an object (e.g. Project, Org, Student, etc.)
// Teamplates Can only be edited if the contract has not yet been sent (status = "DRAFT")
// 2. Changing the template of an object (e.g. Project, Org, Student, etc.)
// 3. Editing the properties of an object (e.g. Project, Org, Student, etc.)
// 4. Assigning a student to a project 
// 5. Unassigning a student from a project
// 6. Assigning an organisation to a project
// 7. Unassigning an organisation from a project


// Definition of Editable Keys for each object type
// These are the keys that can be edited by the user in the Edit Dialog
// The keys are defined as an array of objects, where each object has the following properties:
// key: the key of the object to be edited
// label: the label to be displayed in the edit dialog
// type: the type of the input field to be displayed in the edit dialog
// options: the options to be displayed in the edit dialog (only for select fields)
// required: whether the field is required or not
// editable: whether the field is editable or not
// Note: the key "id" is not editable,
// adminOnly: whether the field is editable by admins only or not

const studentKeys = [
  { key: 'id', label: 'ID', type: 'text', required: true, editable: false, adminOnly: false },
  { key: 'firstName', label: 'First Name', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'name', label: 'Last Name', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'email', label: 'Email', type: 'email', required: true, editable: true, adminOnly: true },
]

const organisationKeys = [
  { key: 'id', label: 'ID', type: 'text', required: true, editable: false, adminOnly: true },
  { key: 'name', label: 'Name', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'juristiction', label: 'Juristiction', type: 'text', required: false, editable: true, adminOnly: true },
]

const projectKeys = [
  { key: 'id', label: 'ID', type: 'text', required: true, editable: false, adminOnly: false },
  { key: 'title', label: 'Title', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'description', label: 'Description', type: 'text', required: true, editable: true, adminOnly: false },
  { key: 'startDate', label: 'Start Date', type: 'date', required: true, editable: false, adminOnly: false },
  { key: 'endDate', label: 'End Date', type: 'date', required: true, editable: false, adminOnly: false },
  { key: 'status', label: 'Status', type: 'select', required: true, editable: true, adminOnly: false, options: ['ACTIVE', 'INACTIVE'] },
  { key: 'loaction', label: 'Location', type: 'text', required: false, editable: true, adminOnly: true },
  { key: 'uniSignatory', label: 'University Signatory', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'uniSignatoryEmail', label: 'University Signatory Email', type: 'email', required: true, editable: true, adminOnly: true },
  { key: 'uniSignatoryPosition', label: 'University Signatory Position', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'orgSignatory', label: 'Organisation Signatory', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'orgSignatoryEmail', label: 'Organisation Signatory Email', type: 'email', required: true, editable: true, adminOnly: true },
  { key: 'orgSignatoryPosition', label: 'Organisation Signatory Position', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'orgNotices', label: 'Organisation Notices Name', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'orgNoticesEmail', label: 'Organisation Notices Email', type: 'text', required: true, editable: true, adminOnly: false },
  { key: 'isSupervisor', label: 'Supervisor', type: 'boolean', required: true, editable: true, adminOnly: false },
  { key: 'isSupervisorEmail', label: 'Supervisor Email', type: 'email', required: true, editable: true, adminOnly: false },
  { key: 'isSupervisorPosition', label: 'Supervisor Position', type: 'text', required: true, editable: true, adminOnly: false },
  { key: 'employment', label: 'Employment', type: 'text', required: true, editable: true, adminOnly: true },
  { key: 'moduleCode', label: 'Module Code', type: 'text', required: true, editable: true, adminOnly: false },
  { key: 'moduleYear', label: 'Module Year', type: 'integer', required: true, editable: true, adminOnly: false },
]

// Copies an object
export const copyObject = (object) => {
  return JSON.parse(JSON.stringify(object));
}

export const formGenerator = (object, objectType, objectSetter, contractTemplates, user) => {
  // Generates form fields for editing objects
  // object: the object to be edited
  // objectType: the type of object to be edited (e.g. 'student', 'project' ...)
  // objectSetter: the setter function for the object (e.g. setStudent, setProject ...)
  let keys = [];
  // Extra Forms For Linked Objects
  let student_letters = [];

  if (objectType === 'student') {
    keys = studentKeys;
  } else if (objectType === 'project') {
    keys = projectKeys;
    student_letters.push(object.studentLetters);
  } else if (objectType === 'organisation') {
    keys = organisationKeys;
  }

  // Box to contain the form fields
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      {formFields(keys, object, objectSetter, contractTemplates, user)}
    </Box>
  );
}

// Generates a form field for each key
const formFields = (keys, object, objectSetter, contractTemplates, user) => {
  return keys.map((key) => {
    if (key.type === 'text' || key.type === 'email') {
      return stringFormFields(key.key, object[key.key], key.label, object, objectSetter, key.required, key.editable, user, key.adminOnly);
    } else if (key.type === 'integer') {
      // return numberFormFields(key.key, object[key.key], object, objectSetter);
      return null;
    } else if (key.type === 'boolean') {
      // return booleanFormFields(key.key, object[key.key], object, objectSetter);
      return null;
    } else if (key.type === 'date') {
      // return dateFormFields(key.key, object[key.key], object, objectSetter);
      return null;
    } else if (key.type === 'select') {
      return selectFormFields(key.key, object[key.key], key.label, object, objectSetter, key.required, key.editable, key.options, user, key.adminOnly);
    } else {
      return null;
    }
  });
}

// Generates a select field
const selectFormFields = (key, value, label, object, objectSetter, required, editable, options, user, adminOnly) => {
  // Generates a select field
  return (
    <Box key={key} width="100%" m={1}>
      <TextField
        id={key}
        label={label}
        variant="outlined"
        fullWidth
        value={value}
        disabled={!editable || (user().role !== 'ADMIN ' && adminOnly)}
        error={required && !value}
        helperText={required && !value ? 'Required' : ''}
        onChange={(e) => {
          objectSetter({ ...object, [key]: e.target.value });
        }}
        required={required}
        select
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

// Generates a text input field
const stringFormFields = (key, value, label, object, objectSetter, required, editable, user, adminOnly) => {
  // Generates a text input field

  return (
    <Box key={key} width="100%" m={1}>
      {/* If the value of string is very long, change it to be a textbox */}
      
      {value && value.length > 100 ? (
        <TextField
          id={key}
          label={label}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          error={required && !value}
          helperText={required && !value ? 'Required' : ''}
          disabled={!editable || (adminOnly && user().role !== 'ADMIN')} 
          value={value}
          onChange={(e) => {
            objectSetter({ ...object, [key]: e.target.value });
          }}
          required={required}
        />
      ) : (
        
        <TextField
          id={key}
          label={label}
          variant="outlined"
          fullWidth
          value={value}
          error={required && !value}
          disabled={!editable || (adminOnly && user().role !== 'ADMIN')}
          helperText={required && !value ? 'Required' : ''}
          onChange={(e) => {
            objectSetter({ ...object, [key]: e.target.value });
          }}
          required={required}
        />
      )}
    </Box>
  );
};

const renderProjectStudentLetters = (studentLetters, contractTemplates, projectSetter, fullObject, user) => {
  // Renders the student letters for a project
  // studentLetters: [{id: 'id', name: 'name', ...}, ...]
  return (
    <Box>
      {studentLetters && studentLetters.map((studentLetter) => renderSingleContract(
        studentLetter,
        contractTemplates,
        studentLetter.student.firstName + ' ' + studentLetter.student.name,
        projectSetter,
        fullObject,
        // Key to be used in the fullObject to set the new value Student Letter + index of the student letter
        'studentLetters[' + fullObject.studentLetters.indexOf(studentLetter) + ']',
        user
      ))}
    </Box>
  );
}

const renderProjectProjectDescription = (projectDescription, contractTemplates, projectSetter, fullObject, user) => {
  return (
    <Box>
      {renderSingleContract(projectDescription, contractTemplates, 'Project Description', projectSetter, fullObject, 'projectDescription', user)}
    </Box>
  );
}

const renderStudentStudentLetters = (studentLetters, contractTemplates, studentSetter, fullObject, user) => {
  return (
    <Box>
      {studentLetters && studentLetters.map((studentLetter) => renderSingleContract(
        studentLetter,
        contractTemplates,
        "Student Letter - Project ID: " + studentLetter.projectId,
        studentSetter,
        fullObject,
        // Key to be used in the fullObject to set the new value Student Letter + index of the student letter
        'letters[' + fullObject.letters.indexOf(studentLetter) + ']',
        user
      ))}
    </Box>
  );
}


const renderOrganisationFrameworkAgreement = (orgFrameworkAgreement, contractTemplates, orgSetter, fullObject, user) => {
  // Renders the framework agreement for an organisation

  return (
    <Box>
      {renderSingleContract(orgFrameworkAgreement, contractTemplates, 'Framework Agreement', orgSetter, fullObject, 'framework', user)}

      <Typography variant="h6" my={1}>Framework Signatories</Typography>

      {renderFrameworkTextField('uniSignatory', orgFrameworkAgreement, orgSetter, 'Uni Signatory', fullObject, user)}
      {renderFrameworkTextField('uniSignatoryEmail', orgFrameworkAgreement, orgSetter, 'Uni Signatory Email', fullObject, user)}
      {renderFrameworkTextField('uniSignatoryPosition', orgFrameworkAgreement, orgSetter, 'Uni Signatory Position', fullObject, user)}
      {renderFrameworkTextField('orgSignatory', orgFrameworkAgreement, orgSetter, 'Org Signatory', fullObject, user)}
      {renderFrameworkTextField('orgSignatoryEmail', orgFrameworkAgreement, orgSetter, 'Org Signatory Email', fullObject, user)}
      {renderFrameworkTextField('orgSignatoryPosition', orgFrameworkAgreement, orgSetter, 'Org Signatory Position', fullObject, user)}
    </Box>
  );
}

const renderFrameworkTextField = (key, framework, objectSetter, label, originalObject, user) => {
  // Renders a text field for the framework agreement originalObject is the original object 
  // ogirg = {..., framework: {...}}  objectSetter is the setter for the original object
  return (
    <Box key={key} width="100%" my={2}>
      <Grid>
        <TextField
          id={key}
          label={label}
          variant="outlined"
          fullWidth
          value={framework[key]}
          required
          error={framework[key] === ''}
          disabled={user().role !== 'ADMIN'}
          helperText={framework[key] === '' ? 'This field is required' : ''}
          onChange={(e) => {
            objectSetter({ ...originalObject, framework: { ...originalObject.framework, [key]: e.target.value } });
          }}
        />
      </Grid>
    </Box>
  );
}

const renderSingleContract = (contract, contractTemplates, label, objectSetter, fullObject, key, user) => {
  // console.log(contract);
  return (
    <Box>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item xs={3}>
          {/* Button Containing only text */}
          <Chip label={label} variant="outlined" />
          {/* Push next button to the end */}
        </Grid>
        <Grid item xs={2}>
          <Chip label={contract.status} variant="outlined" />
        </Grid>
        <Grid item xs={7}>
          <Select
            key={key}
            value={contract.templateId}
            fullWidth
            sx={{ m: 1, width: '100%' }}
            renderValue={(value) => {
              const template = contractTemplates.find((template) => template.id === value);
              return template.name;
            }}
            disabled={contract.status !== 'DRAFT' || user().role !== 'ADMIN'}
            onChange={(e) => {
              // Find the template
              const template = contractTemplates.find((template) => template.id === e.target.value);
              // Check if the key contains an array index, e.g., 'studentLetters[0]'
              const isArrayIndex = key.includes('[');
              if (isArrayIndex) {
                // Extract the array name and index
                const [arrayName, index] = key.split(/[[\]]/).filter(Boolean);
                // Update the specific object within the array
                objectSetter((prevFullObject) => {
                  const newArray = [...prevFullObject[arrayName]];
                  newArray[index] = { ...contract, templateId: template.id };
                  return { ...prevFullObject, [arrayName]: newArray };
                });
              } else {
                // Set the new template id for a non-array case (e.g., 'projectDescription')
                objectSetter((prevFullObject) => ({ ...prevFullObject, [key]: { ...contract, templateId: template.id } }
                ));
              }
            }}
          >
            {contractTemplates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </Box>
  );
}

export const renderObjectContracts = (object, objectType, objectSetter, contractTemplates, user) => {
  // Generates form fields for editing objects
  // object: the object to be edited
  // objectType: the type of object to be edited (e.g. 'student', 'project' ...)
  // objectSetter: the setter function for the object (e.g. setStudent, setProject ...)
  if (objectType === 'project') {
    return (
      <Box>
        <Typography variant="h5">Project Contracts</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">Student Letters</Typography>
        {renderProjectStudentLetters(object.studentLetters, contractTemplates.studentLetterTemplates, objectSetter, object, user)}
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">Project Description</Typography>
        {renderProjectProjectDescription(object.projectDescription, contractTemplates.projectDescriptionTemplates, objectSetter, object, user)}
      </Box>
    );
  } else if (objectType === 'organisation') {
    return (
      <Box>
        <Typography variant="h5">Organisation Contracts</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">Framework Agreement</Typography>
        {renderOrganisationFrameworkAgreement(object.framework, contractTemplates.frameworkAgreementTemplates, objectSetter, object, user)}
      </Box>
    );
  } else if (objectType === 'student') {
    return (
      <Box>
        <Typography variant="h5">Student Contracts</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6">Student Letters</Typography>
        {renderStudentStudentLetters(object.letters, contractTemplates.studentLetterTemplates, objectSetter, object, user)}
      </Box>
    );
  } else {
    return null;
  }
}