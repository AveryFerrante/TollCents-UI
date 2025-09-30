import type { LoaderFunctionArgs } from "react-router";
import { MissingAccessCodeError } from "../../models/errors";
import type { RouteInformation } from "../../models/route-information";
import { fetchRouteInformation } from "../../services/api-service";
import { accessCodeStorage } from "../../services/local-storage-service";

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

  const data = await fetchRouteInformation(
    startAddress,
    endAddress,
    hasTollTag === "true",
    accessCode
  );
  return data;
};
