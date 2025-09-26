import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router";
import type { RouteInformation } from "../../models/route-information";
import RouteInformationSummary from "./route-information-summary";
import RouteInformationTabPanel from "./route-information-tab-panel";
import StartEndInformation from "./start-end-information";

const parseCityState = (address: string): string => {
  const parts = address.split(",");
  if (parts.length < 3) return address;
  const city = parts[1].trim();
  const stateZip = parts[2].trim().split(" ");
  const state = stateZip[0];
  return `${city}, ${state}`;
};

const parseStreetAddress = (address: string): string => {
  const parts = address.split(",");
  if (parts.length < 1) return address; // Return original if no street address found
  return parts[0].trim();
};

const RouteResults = () => {
  const data = useLoaderData<RouteInformation>();
  const [tabValue, setTabValue] = useState(0);
  const hasTollRoute = Boolean(data.tollRouteInformation);
  return (
    <Stack spacing={6}>
      {/* TODO: Investigate react-router link */}
      <Link underline="hover" href="/">
        <Stack direction="row" alignItems="center" spacing={1}>
          <ArrowBack />
          <Typography>Back to Search</Typography>
        </Stack>
      </Link>
      <Card>
        <CardHeader
          title="Trip Details"
          subheader={`Route information from ${parseCityState(
            data.startAddress
          )} to ${parseCityState(data.endAddress)}`}
        />
        <CardContent>
          <Stack spacing={2}>
            <StartEndInformation
              start={`${parseStreetAddress(data.startAddress)}`}
              end={`${parseStreetAddress(data.endAddress)}`}
            />
            {hasTollRoute && (
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
              >
                <Tab label="With Tolls" />
                <Tab label="Avoiding Tolls" />
              </Tabs>
            )}

            {hasTollRoute && (
              <Box hidden={tabValue !== 0}>
                <RouteInformationTabPanel
                  routeInformation={data.tollRouteInformation!}
                  startAddress={data.startAddress}
                  endAddress={data.endAddress}
                />
              </Box>
            )}
            <Box hidden={tabValue !== 1 && hasTollRoute}>
              <RouteInformationTabPanel
                routeInformation={data.avoidTollsRouteInformation!}
                startAddress={data.startAddress}
                endAddress={data.endAddress}
              />
            </Box>

            <RouteInformationSummary routeInfo={data} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default RouteResults;
