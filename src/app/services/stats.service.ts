import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Statistics } from '../models/route';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private readonly endpoint = `${API_BASE_URL}/statistics`;

  constructor(private readonly httpClient: HttpClient) {}

  getPunctuality(
    startDate: Date = new Date(2024, 1, 1),
    endDate: Date = new Date(2024, 12, 31),
  ) {
    const params = new HttpParams()
      .append("startDate", startDate.toISOString())
      .append("endDate", endDate.toISOString());

    return this.httpClient.get<Statistics[]>(
      `${this.endpoint}/punctuality`,
      { params },
    );
  }}
