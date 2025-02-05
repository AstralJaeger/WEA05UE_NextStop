import {Injectable} from '@angular/core';
import {API_BASE_URL} from '../config';
import {HttpClient} from '@angular/common/http';
import {Stop} from '../models/stoppoints';

@Injectable({
  providedIn: 'root'
})
export class StopsService {
  private readonly endpoint = `${API_BASE_URL}/stops`;

  constructor(private readonly httpClient: HttpClient) {
  }

  // create
  postStopPoint(stopPoint: Stop) {
    return this.httpClient.post<Stop>(this.endpoint, stopPoint);
  }

  // read all
  getStopPoints() {
    return this.httpClient.get<Stop[]>(this.endpoint);
  }

  // find
  findStopPoint(query: string) {
    return this.httpClient.get<Stop[]>(`${this.endpoint}/search`, {
      params: {
        q: query
      }
    });
  }

  // read one
  getStopPointById(id: number) {
    return this.httpClient.get<Stop>(`${this.endpoint}/${id}`);
  }

  // update
  putStopPoint(id: number, stopPoint: Stop) {
    return this.httpClient.put<Stop>(`${this.endpoint}/${id}`, stopPoint);
  }

  // delete
  deleteStopPoint(id: number) {
    return this.httpClient.delete<Stop>(`${this.endpoint}/${id}`);
  }
}
