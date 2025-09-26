import { Button, Stack, Typography } from "@mui/material";
import { useRouteError } from "react-router";
import { MissingAccessCodeError } from "../../../models/errors";

const RouteResultsLoadError = () => {
  const error = useRouteError();
  return (
    <>
      {error instanceof MissingAccessCodeError ? (
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h2">Missing Access Code</Typography>
          <Typography variant="body1" color="textSecondary" textAlign="center">
            An access code is required to use this application. Please return to
            the search page and enter a valid access code.
          </Typography>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 2 }}>
            Go to Search Page
          </Button>
        </Stack>
      ) : (
        <p>An unknown error occurred.</p>
      )}
    </>
  );
};

export default RouteResultsLoadError;
