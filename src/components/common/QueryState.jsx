import React from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

/**
 * Renders loading / error / empty states for a react-query result and
 * only shows `children` once data is present.
 */
const QueryState = ({ query, isEmpty, emptyMessage = "Nothing here yet.", children }) => {
  if (query.isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (query.isError) {
    return (
      <Alert severity="error">
        {query.error?.response?.data?.message || "Failed to load data."}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return children;
};

export default QueryState;
