// Component for Displaying a List of Text Items in a nice looking vertical list
// --------------------------------------------------
import React from 'react';
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// Items Must contain a label and a value
// Items can also contain an icon and a link
// If an item has a next item, it will be displayed as a divider

const DetailsList = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          {item.icon && <ListItemIcon>
            {item.icon}
          </ListItemIcon>}
          <ListItemText>
            <Typography variant="h6" component="div">
              {item.label}
            </Typography>
            <Typography variant="body2">
              {item.value}
            </Typography>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default DetailsList;