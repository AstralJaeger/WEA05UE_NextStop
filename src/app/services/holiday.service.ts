import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Holiday} from '../models/holiday';
import {API_BASE_URL} from '../config';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private readonly endpoint = `${API_BASE_URL}/Holiday`;

  constructor(private readonly httpClient: HttpClient) {
  }

  // create
  postHoliday(holiday: Holiday) {
    return this.httpClient.post<Holiday>(this.endpoint, holiday);
  }

  // read
  getHolidays() {
    return this.httpClient.get<Holiday[]>(this.endpoint);
  }

  // update
  putHoliday(holiday: Holiday) {
    return this.httpClient.put<Holiday>(`${this.endpoint}/update/${holiday.id}`, holiday);
  }

  // delete
  deleteHoliday(id: number) {
    return this.httpClient.delete<Holiday>(`${this.endpoint}/delete/${id}`);
  }
}
