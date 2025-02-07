import { Stop } from './stoppoints';

export interface RouteStop {
  routeId: number;
  stopId: number;
  sequenceNumber: number;
  scheduledDepartureTime: Date;
}

export interface InsertRouteStop {
  stopId: number;
  scheduledDepartureTime: Date;
}

export interface Route {
  id: number;
  number: string;
  validFrom: Date;
  validTo: Date;
  daysOfOperation: string;
  stops: RouteStop[];
}

export interface InsertRoute {
  number: string;
  validFrom: Date;
  validTo: Date;
  daysOfOperation: string;
  stops: InsertRouteStop[];
}

export interface Statistics {
  routeNumber: string;
  averageDelaySeconds: number;
  percentPunctual: number;
  percentSlightlyDelayed: number;
  percentDelayed: number;
  percentSignificantlyDelayed: number;
}

export interface NavPoint {
  stop: Stop;
  routeStop: RouteStop
}
