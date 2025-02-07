import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../../common/header/header/header.component';
import { StatsService } from '../../../services/stats.service';
import { Statistics } from '../../../models/route';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { BaseChartDirective } from "ng2-charts";
import { ChartData, ChartOptions } from 'chart.js';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-stats',
  imports: [
    HeaderComponent,
    BaseChartDirective,
    MatDateRangeInput,
    MatFormField,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatSuffix,
    MatDateRangePicker,
    MatButton,
    MatHint,
    MatLabel,
    MatIcon,
    MatStartDate,
    MatEndDate,
    MatProgressSpinner,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})
export class StatsComponent implements OnInit {
  private readonly statsService = inject(StatsService);
  private readonly formBuilder = inject(FormBuilder);
  protected form = this.formBuilder.group({
    startDate: [new Date(2024, 1, 1)],
    endDate: [new Date(2025, 1, 1)],
  });

  // observables
  protected statistics = signal<Statistics[]>([]);
  protected loading = signal<boolean>(false);
  protected error = signal<string | null>(null);
  protected chartData = signal<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  protected chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  };

  ngOnInit() {
    this.fetchStatistics();
  }

  protected fetchStatistics() {
    const { startDate, endDate } = this.form.value;
    this.loading.set(true);
    this.error.set(null);

    if (!startDate || !endDate || startDate > endDate) {
      this.error.set('Invalid date range');
      this.loading.set(false);
      return;
    }

    this.statsService.getPunctuality(startDate, endDate).subscribe({
      next: statistics => {
        this.statistics.set(statistics);
        this.updateChartData(statistics);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(error);
        this.loading.set(false);
      },
    });
  }

  protected updateChartData(data: Statistics[]): void {
    const labels = data.map(stat => `Route ${stat.routeNumber}`);
    const punctualData = data.map(stat => stat.percentPunctual);
    const slightDelayData = data.map(stat => stat.percentSlightlyDelayed);
    const delayData = data.map(stat => stat.percentDelayed);
    const significantDelayData = data.map(stat => stat.percentSignificantlyDelayed);

    this.chartData.set({
      labels,
      datasets: [
        { label: 'Punctual (%)', data: punctualData, backgroundColor: 'green' },
        { label: 'Slightly Delayed (%)', data: slightDelayData, backgroundColor: 'orange' },
        { label: 'Delayed (%)', data: delayData, backgroundColor: 'red' },
        { label: 'Significantly Delayed (%)', data: significantDelayData, backgroundColor: 'darkred' },
      ],
    });
  }
}
