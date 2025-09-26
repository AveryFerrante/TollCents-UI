import { Alert } from "@mui/material";
import type {
  BaseRouteInformation,
  RouteInformation,
  TollRouteInformation,
} from "../../models/route-information";
import { pluralizeWithCount } from "../../utils/stringFormatters";

interface RouteInformationSummaryProps {
  routeInfo: RouteInformation;
}

const computeIsTollRouteFaster = (
  tollRoute: TollRouteInformation,
  avoidTollsRoute: BaseRouteInformation
): { isFaster: boolean; timeDifferenceMinutes: number } => {
  const tollTimeInMinutes =
    tollRoute.driveTime.hours * 60 + tollRoute.driveTime.minutes;
  const avoidTollsTimeInMinutes =
    avoidTollsRoute.driveTime.hours * 60 + avoidTollsRoute.driveTime.minutes;
  return {
    isFaster: tollTimeInMinutes < avoidTollsTimeInMinutes,
    timeDifferenceMinutes: avoidTollsTimeInMinutes - tollTimeInMinutes,
  };
};

const getTollRouteSummaryText = (
  tollRoute: TollRouteInformation,
  timeDifferenceMinutes: number
) => {
  const totalTollPrice =
    tollRoute.guaranteedTollPrice + tollRoute.estimatedDynamicTollPrice;
  const effectiveCostPerMinute = totalTollPrice / timeDifferenceMinutes;
  const effectiveCostPerHour = effectiveCostPerMinute * 60;

  let response = `This toll route saves ${pluralizeWithCount(
    timeDifferenceMinutes,
    "minute"
  )} at a cost of $${totalTollPrice.toFixed(
    2
  )} - equivalent to paying $${effectiveCostPerMinute.toFixed(
    2
  )}/minute ($${effectiveCostPerHour.toFixed(2)}/hour) saved.`;

  if (tollRoute.hasDynamicTolls) {
    response +=
      " It includes dynamic surge-priced tolls, which are estimated and not guaranteed.";
    if (!tollRoute.processedAllDynamicTolls)
      response +=
        " Some of these couldn’t be processed and were excluded from estimates.";
    response += ` Guaranteed tolls are $${tollRoute.guaranteedTollPrice.toFixed(
      2
    )}.`;
    if (tollRoute.estimatedDynamicTollPrice > 0) {
      response += ` Estimated dynamic tolls are $${tollRoute.estimatedDynamicTollPrice.toFixed(
        2
      )}.`;
    }
  }

  return response;
};

const RouteInformationSummary = ({
  routeInfo,
}: RouteInformationSummaryProps) => {
  const hasMultipleRoutes = Boolean(routeInfo.tollRouteInformation);
  if (!hasMultipleRoutes) {
    return (
      <Alert severity="info" variant="outlined">
        No alternative toll route options.
      </Alert>
    );
  }

  const tollRoute = routeInfo.tollRouteInformation!;
  const { isFaster, timeDifferenceMinutes } = computeIsTollRouteFaster(
    tollRoute,
    routeInfo.avoidTollsRouteInformation
  );
  if (isFaster) {
    return (
      <Alert severity="info" variant="outlined">
        {getTollRouteSummaryText(tollRoute, timeDifferenceMinutes)}
      </Alert>
    );
  } else {
    return (
      <Alert severity="error" variant="outlined">
        The toll route is slower by{" "}
        {pluralizeWithCount(-1 * timeDifferenceMinutes, "minute")}! The only
        consideration is fuel economy vs. distance
      </Alert>
    );
  }
};

export default RouteInformationSummary;
