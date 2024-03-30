import { styled } from '@mui/material/styles';
import MuiGrid from '@mui/material/Grid';
import MultiLineTextField from '../base/MultiLineTextField';
import ChildCard from '../base/ChildCard';
import { Box } from '@mui/system';
import { Button } from '@mui/material';


const Grid = styled(MuiGrid)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2),
  },
}));

const textEmail = `Dear {student_name}, 

this is a reminder to sign up the contract for your {project_name} project in the {program} programme. 

You should have received this contract from DocuSign. 

If you have not received one please contact your supervisor immediately.` ;

export default function VerticalDividerText() {

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <MultiLineTextField
          title="Your Message"
          children={textEmail}>
        </MultiLineTextField>
        <Button variant="outlined">UPDATE TEMPLATE</Button>
      </Grid>

      <Grid item xs={6}>
        <ChildCard
          title="Email Variables"
          children='You can use these variables in your Email body'>
          <Box display="flex" flexDirection="column">
            <div style={{ marginBottom: '20px' }}>
              <Box component="span"
                sx={{
                  width: '115px',
                  height: '40px',
                  p: 1,
                  borderRadius: 2,
                  mb: 1,
                  border: '1px dashed grey'
                }}>
                Student Name
              </Box>
              <span style={{ marginLeft: '10px', marginBottom: '10px' }}>Student's name to whom you are sending email</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Box component="span"
                sx={{
                  width: '115px',
                  height: '40px',
                  t: 4,
                  p: 1,
                  borderRadius: 2,
                  mb: 1,
                  border: '1px dashed grey'
                }}>
                Project Name
              </Box>
              <span style={{ marginLeft: '10px' }}>Value for the project name</span>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Box component="span"
                sx={{
                  width: '115px',
                  height: '40px',
                  t: 6,
                  p: 1,
                  borderRadius: 2,
                  mb: 1,
                  border: '1px dashed grey'
                }}>
                Project Code
              </Box>
              <span style={{ marginLeft: '10px' }}>Value for the project code</span>
            </div>
          </Box>
        </ChildCard>
      </Grid>
    </Grid>
  );
}