import {
  AttachMoney,
  DirectionsCar,
  Route,
  WatchLater,
} from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import type {
  BaseRouteInformation,
  TollRouteInformation,
} from "../../models/route-information";
import {
  hoursMinutesNormalized,
  pluralizeWithCount,
} from "../../utils/stringFormatters";
import InformationHighlight from "./information-highlight";

interface RouteInformationTabPanelProps {
  routeInformation: BaseRouteInformation | TollRouteInformation;
  startAddress: string;
  endAddress: string;
}
const RouteInformationTabPanel = ({
  routeInformation,
  startAddress,
  endAddress,
}: RouteInformationTabPanelProps) => {
  const isTollRoute = "guaranteedTollPrice" in routeInformation;
  const urlParams = new URLSearchParams({
    api: "1",
    origin: startAddress,
    destination: endAddress,
    travelmode: "driving",
  });
  if (!isTollRoute) {
    urlParams.set("avoid", "tolls");
  }
  const openInGoogleMapsUrl = `https://www.google.com/maps/dir/?${urlParams.toString()}`;
  return (
    <Stack spacing={2}>
      {isTollRoute && (
        <InformationHighlight
          title="Toll Price"
          subText={
            routeInformation.hasDynamicTolls
              ? "* This route contains surge-priced tolls which are estimates."
              : undefined
          }
          infoHighlight={`$${(
            routeInformation.guaranteedTollPrice +
            routeInformation.estimatedDynamicTollPrice
          ).toFixed(2)}${routeInformation.hasDynamicTolls ? "*" : ""}`}
          icon={AttachMoney}
        />
      )}
      <InformationHighlight
        title="Distance"
        infoHighlight={`${pluralizeWithCount(
          Number(routeInformation.distanceInMiles.toFixed(1)),
          "mile",
          "miles"
        )}`}
        icon={Route}
      />
      <InformationHighlight
        title="Drive Time"
        infoHighlight={`${hoursMinutesNormalized(
          routeInformation.driveTime.hours,
          routeInformation.driveTime.minutes
        )}`}
        icon={WatchLater}
      />
      <Stack spacing={0.5}>
        <Button
          startIcon={<DirectionsCar />}
          fullWidth
          variant="contained"
          color="success"
          href={openInGoogleMapsUrl}
          target="_blank"
        >
          View Route on Google Maps
        </Button>
        {routeInformation.description && (
          <Typography
            variant="subtitle2"
            color="text.disabled"
            sx={{ fontStyle: "italic" }}
            pl={2.5}
          >
            {`- Via ${routeInformation.description}`}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default RouteInformationTabPanel;
