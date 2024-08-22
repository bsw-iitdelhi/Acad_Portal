import React from "react";
import {
  Box,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
} from "@mui/material";

const QueryList = ({ title, data, filterFn, onItemClick }) => {
  const filteredData = data.filter(filterFn);

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      width="100%"
      sx={{
        borderRadius: "20px",
        bgcolor: "#f2f0f5",
        py: "30px",
        mb: "30px",
      }}
      alignItems={!data && "center"}
    >
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      {filteredData.length > 0 ? (
        filteredData.map((item) => (
          <ListItem button key={item._id} onClick={() => onItemClick(item)}>
            <ListItemText primary={item.description} />
          </ListItem>
        ))
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default QueryList;