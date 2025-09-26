import type { LoaderFunctionArgs } from "react-router";
import { MissingAccessCodeError } from "../../models/errors";
import type { RouteInformation } from "../../models/route-information";
import { accessCodeStorage } from "../../services/local-storage-service";

const fakeData: RouteInformation = {
  startAddress: "123 Main St, Springfield, IL 62701",
  endAddress: "456 Elm St, Shelbyville, IL 62565",
  avoidTollsRouteInformation: {
    driveTime: { hours: 1, minutes: 30 },
    distanceInMiles: 100,
    description: "Avoiding Tolls Route",
  },
  tollRouteInformation: {
    driveTime: { hours: 1, minutes: 15 },
    distanceInMiles: 90,
    description: "Toll Route",
    hasDynamicTolls: true,
    guaranteedTollPrice: 5.0,
    estimatedDynamicTollPrice: 10.0,
    processedAllDynamicTolls: true,
  },
};

export const RouteResultsLoader = async ({
  request,
}: LoaderFunctionArgs<RouteInformation>) => {
  const accessCode = accessCodeStorage.get();
  if (!accessCode || accessCode.length === 0) {
    // use useRouterError() hook to get error info in component
    throw new MissingAccessCodeError();
  }
  const url = new URL(request.url);
  // TODO: validate params are not empty
  const startAddress = url.searchParams.get("start") || "";
  const endAddress = url.searchParams.get("end") || "";
  const hasTollTag = url.searchParams.get("hasTollTag") || "false";

  // const data = await fetchRouteInformation(
  //   startAddress,
  //   endAddress,
  //   hasTollTag === "true",
  //   accessCode
  // );
  return fakeData;
};
