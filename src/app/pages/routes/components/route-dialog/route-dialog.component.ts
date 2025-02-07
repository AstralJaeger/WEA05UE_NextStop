import { Component, EventEmitter, Inject, inject, Input, OnInit, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { InsertRoute, InsertRouteStop, Route, RouteStop } from '../../../../models/route';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RoutesService} from '../../../../services/routes.service';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {NgForOf, NgIf} from '@angular/common';
import {MatOption} from '@angular/material/core';
import {StopsService} from '../../../../services/stops.service';
import {Stop} from '../../../../models/stoppoints';
import {MatSelect} from '@angular/material/select';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';

@Component({
  selector: 'app-route-dialog',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatHint,
    MatSuffix,
    NgIf,
    NgForOf,
    MatOption,
    MatSelect,
    MatIconButton,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle
  ],
  templateUrl: './route-dialog.component.html',
  styleUrl: './route-dialog.component.css'
})
export class RouteDialogComponent implements OnInit {

  @Input()
  route: Route | null = null;

  @Output()
  routeChanged = new EventEmitter<Route | InsertRoute>();

  private readonly dialogRef = inject(MatDialogRef<RouteDialogComponent>);
  private readonly _snackbar = inject(MatSnackBar);

  formBuilder = inject(FormBuilder);
  private readonly routesService = inject(RoutesService);
  private readonly stopsService = inject(StopsService);

  protected allStops: Stop[] = [];

  public readonly form = this.formBuilder.group({
    number: ['1', Validators.required],
    validFrom: [new Date(), Validators.required],
    validTo: [new Date(), Validators.required],
    daysOfOperation: ['', Validators.required],
    stops: this.formBuilder.array([
      this.formBuilder.group({
        stopId: [0, Validators.required],
        scheduledDepartureTime: [new Date(), Validators.required]
      })
    ]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: { route: Route | null }) {
    this.route = data.route;
  }

  ngOnInit() {
    this.fetchStops();

    if (!this.route) return;
    this.form.patchValue({
      number: this.route.number,
      validFrom: this.route.validFrom,
      validTo: this.route.validTo,
      daysOfOperation: this.route.daysOfOperation,
    });

    const stopsArray = this.form.get("stops") as FormArray;
    stopsArray.clear();
    this.route.stops.forEach(stop => stopsArray.push(this.formBuilder.group({
      stopId: [stop.stopId, Validators.required],
      scheduledDepartureTime: [stop.scheduledDepartureTime, Validators.required]
    })));
  }

  private fetchStops() {
    this.stopsService.getStopPoints().subscribe({
      next: v => {
        this.allStops = v;
      },
      error: e => {
        console.error('error fetching stops', e);
      }
    })
  }


  get stops(): FormArray {
    return this.form.get('stops') as FormArray;
  }

  protected addStop(stopId = 0, scheduledDepartureTime = "") {
    const stopGroup = this.formBuilder.group({
      stopId: [stopId, Validators.required],
      scheduledDepartureTime: [scheduledDepartureTime, Validators.required]
    });
    this.stops.push(stopGroup);
  }

  protected removeStop(index: number) {
    this.stops.removeAt(index)
  }

  protected upStop(index: number) {
    if (index <= 0) return;
    const stopsArray = this.stops;
    const currentStop = stopsArray.at(index);
    const previousStop = stopsArray.at(index - 1);
    stopsArray.setControl(index, previousStop);
    stopsArray.setControl(index - 1, currentStop);

  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._snackbar.open('Please ensure all fields are valid!', 'Close', {
        duration: 5000
      });
      return;
    }

    if (this.route) {
      this.updateRoute();
    } else {
      this.createRoute();
    }
  }

  private createRoute() {
    const rtData = this.form.value;

    const insertStops = rtData.stops!.map((stData) => {
      return {
        stopId: stData.stopId!,
        scheduledDepartureTime: stData.scheduledDepartureTime!,
      } as InsertRouteStop;
    });

    const route: InsertRoute = {
      number: `${rtData.number!}`,
      validFrom: rtData.validFrom!,
      validTo: rtData.validTo!,
      daysOfOperation: rtData.daysOfOperation!,
      stops: insertStops,
    }

    this.routesService.postRoute(route).subscribe({
      next: () => {
        this._snackbar.open('Route created successfully!', 'Close', {
          duration: 3000
        });
        this.routeChanged.emit(route);
        this.dialogRef.close();
      },
      error: () => {
        this._snackbar.open('Error creating route!', 'Close', {
          duration: 3000
        });
      }
    })
  }

  private updateRoute() {
    const rtData = this.form.value;

    const stops = rtData.stops!.map((stData, index) => {
      return {
        routeId: this.route!.id,
        stopId: stData.stopId!,
        scheduledDepartureTime: stData.scheduledDepartureTime!,
        sequenceNumber: index
      } as RouteStop
    });

    const route: Route = {
      id: this.route!.id,
      number: `${rtData.number!}`,
      validFrom: rtData.validFrom!,
      validTo: rtData.validTo!,
      daysOfOperation: rtData.daysOfOperation!,
      stops: stops,
    }

    this.routesService.putRoute(route).subscribe({
      next: () => {
        this._snackbar.open('Route updated successfully!', 'Close', {
          duration: 3000
        });
        this.routeChanged.emit(route);
        this.dialogRef.close();
      },
      error: () => {
        this._snackbar.open('Error updating route!', 'Close', {
          duration: 3000
        });
      }
    })
  }

  protected readonly stop = stop;
}
