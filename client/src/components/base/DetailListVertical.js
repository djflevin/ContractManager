import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Typography, Grid } from '@mui/material';
const DetailsListVertical = ({ items }) => {
  const midIndex = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midIndex);
  const rightItems = items.slice(midIndex);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <List>
          {leftItems.map((item, index) => (
            <ListItem key={index}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>
                <Typography variant="h6" component="div">
                  {item.label}
                </Typography>
                <Typography variant="body2">{item.value}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={6}>
        <List>
          {rightItems.map((item, index) => (
            <ListItem key={index}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>
                <Typography variant="h6" component="div">
                  {item.label}
                </Typography>
                <Typography variant="body2">{item.value}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default DetailsListVertical;
