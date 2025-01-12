import {Injectable} from '@angular/core';
import {API_BASE_URL} from '../config';
import {HttpClient} from '@angular/common/http';
import {StopPoint, StopPointForUpdate} from '../models/stoppoints';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
  private readonly endpoint = `${API_BASE_URL}/StopPoint`;

  constructor(private readonly httpClient: HttpClient) {
  }

  // create
  postStopPoint(stopPoint: StopPointForUpdate) {
    return this.httpClient.post<StopPointForUpdate>(this.endpoint, stopPoint);
  }

  // read all
  getStopPoints() {
    return this.httpClient.get<StopPoint[]>(this.endpoint);
  }

  // read one
  getStopPointById(id: number) {
    return this.httpClient.get<StopPoint>(`${this.endpoint}/by-id/${id}`);
  }

  // read one
  findStopPoint(query: string) {
    return this.httpClient.get<StopPoint[]>(`${this.endpoint}/search`, {
      params: {
        q: query
      }
    });
  }

  // update
  putStopPoint(id: number, stopPoint: StopPointForUpdate) {
    return this.httpClient.put<StopPoint>(`${this.endpoint}/update/${id}`, stopPoint);
  }

  // delete
  deleteStopPoint(id: number) {
    return this.httpClient.delete<StopPoint>(`${this.endpoint}/delete/${id}`);
  }
}
