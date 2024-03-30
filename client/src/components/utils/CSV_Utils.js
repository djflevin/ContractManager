import Papa from 'papaparse';
import Alert from '@mui/material/Alert';
// CSV Upload involves the following steps:
// 1. User selects a CSV file 
// 2. The file is read and parsed into a JSON object
// 3. The JSON object is validated for correct Headers and Data
// 4. The user is shown a preview of the data inclding any data errors
// 5. The user can change the data and upload it to the database or cancel the upload


const unpackCSV = async (file, dispatch, dataSetter) => {
  // Get the CSV file from the file input element
  // const file = document.querySelector('#csv-file').files[0];
  // Create a new FileReader instance
  const reader = new FileReader();
  // When the file has been read...
  reader.addEventListener('load', (event) => {
    // Convert the file to text
    const csv = event.target.result;
    // Use PapaParse to parse the CSV data
    // Drop empty lines
    const results = Papa.parse(csv,
      { header: true },
      { skipEmptyLines: true }
    );
    dispatch(dataSetter(results.data));
  });
  // Read the file as text
  reader.readAsText(file);
}

const validateRow = (row) => {
  const required_keys = [
    "employment", "org_signatory_name", "org_signatory_email", "organisation", "org_jurisdiction",
    "project_title", "project_description", "module_code", "module_year", "university_signatory_name",
    "university_signatory_email", "university_program", "location", "student_name", "start_date",
    "end_date", "university_supervisor", "university_supervisor_email", "student_first_name", "student_id"
  ];
  let valid = true;
  let missing_keys = [];

  for (let j = 0; j < required_keys.length; j++) {
    let key = required_keys[j];
    let errorMessages = validationRules(key, row[key]);
    if (errorMessages.length > 0) {
      valid = false;
      missing_keys.push(key);
    }
  }
  return { valid, missing_keys };
};

const validateData = (csvData) => {
  // Validate the data in the csv file
  let validProjectRows = [];
  let invalidProjectRows = [];
  let hasData = true;

  // Validate data in the csv file
  csvData.forEach((row, index) => {
    // Check if the row is blank line or not
    let { valid } = validateRow(row, index);

    if (valid) {
      validProjectRows.push(row);
    } else {
      invalidProjectRows.push(row);
      // errorMessages.push(errors.join(', '));
    }
  });
  return { validProjectRows, invalidProjectRows, hasData };
};

const validateHeaders = (data) => {
  // Check if the headers are valid and all required headers are present in all rows
  const expectedHeaders = [
    "employment", "org_signatory_name", "org_signatory_email", "org_signatory_position",
    "organisation", "org_jurisdiction", "project_title", "project_description", "module_code",
    "module_year", "university_signatory_name", "university_signatory_email", "university_signatory_position",
    "university_program", "university_reference", "location", "student_name", "start_date", "end_date",
    "university_supervisor", "university_supervisor_email", "is_name", "is_position", "is_email", "org_notices_name",
    "org_notices_email", "student_email", "student_reference", "student_first_name", "student_id"
  ];

  let missingHeaders = [];
  let valid = true;

  // Check that there is data
  if (data.length === 0) {
    return { valid: false, missingHeaders: expectedHeaders };
  }

  // Check that there are headers
  const actualHeaders = Object.keys(data[0]);
  if (expectedHeaders.length !== actualHeaders.length) {
    return { valid: false, missingHeaders: expectedHeaders };
  }
  // Check that all required headers are present
  for (let i = 0; i < expectedHeaders.length; i++) {
    if (expectedHeaders[i] !== actualHeaders[i]) {
      missingHeaders.push(expectedHeaders[i]);
      valid = false;
    }
  }
  return { valid, missingHeaders };
}


const requiredCellFormatter = ({ cell, key }) => {
  // Format the cell if it does not pass validation rules
  const value = cell.getValue();

  const errorMessages = validationRules(key, value);

  if (errorMessages.length > 0) {
    return (
      <Alert severity="error">
        {errorMessages.map((errorMsg, index) => (
          <div key={index}>{errorMsg}</div>
        ))}
      </Alert>
    );
  } else {
    return value;
  }
};

const validationRules = (key, value) => {
  // Validate the value of a cell against a set of rules
  // Return an array of error messages
  // If the array is empty, the value is valid
  // If the array is not empty, the value is invalid
  // Catch any errors and return an empty array
  try {

    // Define the validation rules
    const valRules = {
      no_rules: {
        test: (value) => true,
        errorMsg: '',
      },
      not_empty: {
        test: (value) => value !== '',
        errorMsg: 'This field is required',
      },
      date: {
        test: (value) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value),
        errorMsg: 'Value must be a valid date in the format DD/MM/YYYY',
      },
      email: {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMsg: 'Value must be a valid email address',
      },
      one_word: {
        test: (value) => value.split(' ').length === 1,
        errorMsg: 'Value must be a single word',
      },
      two_words: {
        test: (value) => value.split(' ').length === 2,
        errorMsg: 'Value must be two words',
      },
      less_than_100: {
        test: (value) => value.length <= 100,
        errorMsg: 'Value must be less than 100 characters',
      },
      boolean: {
        test: (value) => value === 'true' || value === 'false',
        errorMsg: 'Value must be either true or false',
      },
      number: {
        test: (value) => !isNaN(value),
        errorMsg: 'Value must be a valid number',
      },
      less_than_1000: {
        test: (value) => value.length <= 1000,
        errorMsg: 'Value must be less than 1000 characters',
      },
      years: {
        test: (value) => /^([1-9]|10)$/.test(value),
        errorMsg: 'Value must be a number between 1 and 10',
      },
    };

    // Get the validation rules for the key 
    const rules = {
      employment: ['not_empty'],
      org_signatory_name: ['not_empty'],
      org_signatory_email: ['not_empty', 'email'],
      org_signatory_position: ['not_empty'],
      organisation: ['not_empty'],
      org_jurisdiction: ['not_empty'],
      project_title: ['not_empty', 'less_than_100'],
      project_description: ['not_empty', 'less_than_1000'],
      module_code: ['not_empty'],
      module_year: ['not_empty', 'years'],
      university_signatory_name: ['not_empty'],
      university_signatory_email: ['not_empty', 'email'],
      university_signatory_position: ['not_empty'],
      university_program: ['not_empty'],
      university_reference: [],
      location: ['not_empty'],
      student_name: ['not_empty', 'one_word'],
      start_date: ['not_empty', 'date'],
      end_date: ['not_empty', 'date'],
      university_supervisor: ['not_empty'],
      university_supervisor_email: ['not_empty', 'email'],
      is_name: ['not_empty'],
      is_position: [],
      is_email: [],
      org_notices_name: [],
      org_notices_email: [],
      student_email: ['not_empty', 'email'],
      student_reference: [],
      student_first_name: ['not_empty'],
      student_id: ['not_empty'],
    };

    let errorMessages = [];
    // Check if the key has any validation rules defined for it 
    // If it does, check if the value passes the rules
    if (rules.hasOwnProperty(key)) {
      for (const rule of rules[key])
        if (!valRules[rule].test(value)) {
          errorMessages.push(valRules[rule].errorMsg);
        }
    }

    return errorMessages;
  } catch (error) {
    console.log(error);
    return [];
  }
};


// Configure the table columns
// Each column has a header, accessorKey, and Cell formatter function in case the cell needs to be formatted due to validation errors
const tableColumns = () => [
  {
    header: "employment", accessorKey: "employment", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "employment" }); }
  },
  {
    header: "org_signatory_name", accessorKey: "org_signatory_name", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "org_signatory_name" }); }
  },
  {
    header: "org_signatory_email", accessorKey: "org_signatory_email", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "org_signatory_email" }); }
  },
  { header: "org_signatory_position", accessorKey: "org_signatory_position" },
  {
    header: "organisation", accessorKey: "organisation", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "organisation" }); }
  },
  { header: "org_jurisdiction", accessorKey: "org_jurisdiction" },
  {
    header: "project_title", accessorKey: "project_title", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "project_title" }); }
  },
  {
    header: "project_description", accessorKey: "project_description", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "project_description" }); }
  },
  {
    header: "module_code", accessorKey: "module_code", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "module_code" }); }
  },
  {
    header: "module_year", accessorKey: "module_year", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "module_year" }); }
  },
  {
    header: "university_signatory_name", accessorKey: "university_signatory_name", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "university_signatory_name" }); }
  },
  {
    header: "university_signatory_email", accessorKey: "university_signatory_email", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "university_signatory_email" }); }
  },
  { header: "university_signatory_position", accessorKey: "university_signatory_position" },
  {
    header: "university_program", accessorKey: "university_program", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "university_program" }); }
  },
  { header: "university_reference", accessorKey: "university_reference" },
  { header: "location", accessorKey: "location" },
  {
    header: "student_name", accessorKey: "student_name", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "student_name" }); }
  },
  {
    header: "start_date", accessorKey: "start_date",
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "start_date" }); }
  },
  {
    header: "end_date", accessorKey: "end_date",
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "end_date" }); }
  },
  {
    header: "university_supervisor", accessorKey: "university_supervisor", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "university_supervisor" }); }
  },
  {
    header: "university_supervisor_email", accessorKey: "university_supervisor_email", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "university_supervisor_email" }); }
  },
  { header: "is_name", accessorKey: "is_name", Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "is_name" }); } },
  { header: "is_position", accessorKey: "is_position", Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "is_position" }); } },
  { header: "is_email", accessorKey: "is_email", Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "is_email" }); } },
  { header: "org_notices_name", accessorKey: "org_notices_name", Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "org_notices_name" }); } },
  { header: "org_notices_email", accessorKey: "org_notices_email", Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "org_notices_email" }); } },
  {
    header: "student_email", accessorKey: "student_email", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "student_email" }); }
  },
  { header: "student_reference", accessorKey: "student_reference" },
  {
    header: "student_first_name", accessorKey: "student_first_name", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "student_first_name" }); }
  },
  {
    header: "student_id", accessorKey: "student_id", muiTableBodyCellEditTextFieldProps: { required: true },
    Cell: ({ cell }) => { return requiredCellFormatter({ cell, key: "student_id" }); }
  },
]


export { unpackCSV, validateData, validateHeaders, tableColumns, validateRow }

