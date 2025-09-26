export interface RouteInformation {
  avoidTollsRouteInformation: BaseRouteInformation;
  tollRouteInformation?: TollRouteInformation;
  startAddress: string;
  endAddress: string;
}

export interface TollRouteInformation extends BaseRouteInformation {
  guaranteedTollPrice: number;
  estimatedDynamicTollPrice: number;
  hasDynamicTolls: boolean;
  processedAllDynamicTolls: boolean;
}

export interface BaseRouteInformation {
  distanceInMiles: number;
  driveTime: DriveTime;
  description?: string;
}

interface DriveTime {
  hours: number;
  minutes: number;
}
