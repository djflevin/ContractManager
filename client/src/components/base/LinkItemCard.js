// Card Containing Details of an Item in a List and a Link to the Item
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Grid, Typography, Box, Button } from "@mui/material";

const LinkItemCard = ({ title, subtitle, link }) => {
  return (
    <Card raised={true} sx={{ mt: 1 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2">{subtitle}</Typography>
          </Grid>

          <Grid item xs={2}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link href={link} target="_blank">
                <Button variant="text" size="small">
                  View
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default LinkItemCard;