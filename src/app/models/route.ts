export type RouteStop = {
  routeId: number;
  stopId: number;
  sequenceNumber: number;
  scheduledDepartureTime: Date;
};

export type InsertRouteStop = {
  stopId: number;
  scheduledDepartureTime: Date;
};

export type Route = {
  id: number;
  number: string;
  validFrom: Date;
  validTo: Date;
  daysOfOperation: string;
  stops: RouteStop[];
};

export type InsertRoute = {
  number: string;
  validFrom: Date;
  validTo: Date;
  daysOfOperation: string;
  stops: RouteStop[];
};
