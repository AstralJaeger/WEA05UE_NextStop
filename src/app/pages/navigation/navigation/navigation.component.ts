import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../../common/header/header/header.component';
import { StopsService } from '../../../services/stops.service';
import { RoutesService } from '../../../services/routes.service';
import { Stop } from '../../../models/stoppoints';
import { NavPoint, Route, RouteStop } from '../../../models/route';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NgForOf } from '@angular/common';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-search',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatIcon,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    MatIconButton,
    MatDivider,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent implements OnInit {
  private readonly stopsService = inject(StopsService);
  private readonly routesService = inject(RoutesService);

  protected readonly routesCache = signal<Route[]>([]);
  protected readonly stopsCache = signal(new Map<number, Stop>());
  protected readonly routesResult = signal<Route[]>([]);

  private readonly _snackbar = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.group({
    stopId: [0, Validators.required],
  });

  constructor() {}

  ngOnInit(): void {
    this.fetchRoutes(() => this.onLocateBtnClick());
  }

  private fetchRoutes(onDone?: () => void): void {
    this.routesService.getRoutes().subscribe({
      next: v => {
        this.routesCache.set(v);

        for (const data of this.routesCache()) {
          for (const rs of data.stops) {
            this.stopsService.getStopPointById(rs.stopId).subscribe({
              next: value => {
                this.stopsCache().set(rs.stopId, value);
                if (onDone) {
                  onDone();
                }
              },
              error: err => {
                console.warn('error fetching stop', err);
              },
            });
          }
        }
      },
      error: e => {
        console.error('error fetching rotues: ', e);
        this._snackbar.open('Error fetching routes', 'Close', {
          duration: 5000,
        });
      },
    });
  }

  protected onSearchBtnClick() {
    const stopId = this.form.get('stopId')?.value;
    console.log(`Searching for routes with stopId: ${stopId} - ${this.stopsCache().get(stopId!)}`);

    if (stopId) {
      const routes = this.routesCache().filter(r => r.stops.some(s => s.stopId === stopId));
      this.routesResult.set(routes);
    }
  }

  protected onLocateBtnClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log('Latitude: ', position.coords.latitude);
        console.log('Longitude: ', position.coords.longitude);

        const closestStop = this.findClosestStop(position.coords.latitude, position.coords.longitude);
        if (closestStop) {
          this.form.setValue({
            stopId: closestStop.id,
          });
          this._snackbar.open(`Closest stop is ${closestStop.name}`, 'Close', {
            duration: 5000,
          });
        } else {
          this._snackbar.open('No stops found', 'Close', {
            duration: 5000,
          });
        }
      });
    } else {
      this._snackbar.open('Geolocation is not supported by this browser.', 'Close');
    }
  }

  protected getStopOnRoute(route: Route): NavPoint {
    const stopId = this.form.get('stopId')?.value;

    const rs = route.stops.find(s => s.stopId === stopId)!;
    return {
      routeStop: rs,
      stop: this.stopsCache().get(rs.stopId)!,
    };
  }

  protected getRouteDestination(route: Route): NavPoint {

    const rs = route.stops[route.stops.length - 1]!
    return {
      routeStop: rs,
      stop: this.stopsCache().get(rs.stopId)!,
    }
  }

  /**
   * Finds the closest stop in the `stopsCache` using the Haversine formula.
   *
   * jatjippity generated
   * @param userLat - User's latitude.
   * @param userLon - User's longitude.
   * @returns The closest stop or `undefined` if the cache is empty.
   */
  private findClosestStop(userLat: number, userLon: number): Stop | undefined {
    if (this.stopsCache().size === 0) {
      return undefined;
    }

    let closestStop: Stop | undefined;
    let minDistance = Number.MAX_VALUE;

    this.stopsCache().forEach(stop => {
      const distance = this.calculateDistance(userLat, userLon, stop.latitude, stop.longitude);

      if (distance < minDistance) {
        minDistance = distance;
        closestStop = stop;
      }
    });

    return closestStop;
  }

  /**
   * Calculates the distance between two geographic points using the Haversine formula.
   *
   * jatjippity generated
   * @param lat1 - Latitude of the first point.
   * @param lon1 - Longitude of the first point.
   * @param lat2 - Latitude of the second point.
   * @param lon2 - Longitude of the second point.
   * @returns The distance in kilometers between the two points.
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Converts degrees to radians.
   *
   * jatjippity generated
   * @param degrees - Angle in degrees.
   * @returns The angle in radians.
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
