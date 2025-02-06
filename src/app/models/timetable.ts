export type Timetable = {
  routeId: number;
  startStopId: number;
  endStopId: number;
  scheduledDepartureTime: Date;
  scheduledArrivalTime: Date;
  realDepartureTime: Date;
  realArrivalTime: Date;
}[];
