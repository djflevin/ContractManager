import { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function CollapseBox({ title, children, link, ...props }) {
  const [open, setOpen] = useState(false);

  const handleExpandClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 920,
          border: "1px solid #e0e0e0",
          cursor: "pointer",

        }}
        // Overwrite any sx props if passed in
        {...props}
        variant="outlined"
        onClick={handleExpandClick}>
        <CardHeader
          className="my-card-header"
          title={title}
          action={
            <IconButton
              onClick={handleExpandClick}
              aria-label="expand"
              size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }></CardHeader>
        <div style={{ backgroundColor: "white" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent>
              <Container
                sx={{ maxHeight: 900, lineHeight: 2 }}
                onClick={(e) => e.stopPropagation()}>
                {children}
                {
                  (link !== undefined && link !== null && link !== "") &&
                  <Link to={link}>
                    <Button variant="text" size="small">
                      See More
                    </Button>
                  </Link>
                }
              </Container>
            </CardContent>
          </Collapse>
        </div>
      </Card>
      <style>
        {` .my-card-header .MuiCardHeader-title {
                    font-size: 16px; // set the font size to 16px
                }
            `}
      </style>
    </>
  );
}
