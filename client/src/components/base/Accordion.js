import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, Button } from '@mui/material';
export default function SimpleAccordion({ title, children, link }) {
  return (
    <div>
      <Accordion
        sx={{ mb: 1 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {children}
            <Link href={link} target="_blank">
              <Button variant="text" size="small">
                See More
              </Button>
            </Link>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}