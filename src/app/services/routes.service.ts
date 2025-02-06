import {Injectable} from '@angular/core';
import {API_BASE_URL} from '../config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Route} from '../models/route';
import {Timetable} from '../models/timetable';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  private readonly endpoint = `${API_BASE_URL}/routes`;

  constructor(private readonly httpClient: HttpClient) {
  }

  getRoutes() {
    return this.httpClient.get<Route[]>(this.endpoint);
  }

  postRoute(route: Route) {
    return this.httpClient.post<Route>(this.endpoint, route);
  }

  putRoute(route: Route) {
    return this.httpClient.put(`${this.endpoint}/${route.id}`, route);
  }

  deleteRoute(route: Route) {
    return this.httpClient.delete(`${this.endpoint}/${route.id}`);
  }

  getTimetable(startStopId: number, endStopId: number, date: Date, isArrival: boolean, limit: number) {
    const params = new HttpParams()
      .append('startStopId', startStopId)
      .append('endStopId', endStopId)
      .append('dateTime', date.toISOString())
      .append('isArrivalTime', isArrival)
      .append('limit', limit);

    return this.httpClient.get<Timetable>(`${this.endpoint}/timetable`, {params});
  }
}
