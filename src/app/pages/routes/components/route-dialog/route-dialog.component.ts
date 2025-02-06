import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InsertRouteStop, Route, RouteStop} from '../../../../models/route';
import {MatSnackBar} from '@angular/material/snack-bar';
import {RoutesService} from '../../../../services/routes.service';
import {Result} from 'postcss';
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
  routeChanged = new EventEmitter<Route>();

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
        stopId: [null, Validators.required],
        scheduledDepartureTime: [new Date(), Validators.required]
      })
    ]),
  });

  constructor() {
  }

  ngOnInit() {
    this.fetchStops();
    if (this.route) {
      this.form.setValue({
        number: this.route.number,
        validFrom: this.route.validFrom,
        validTo: this.route.validTo,
        daysOfOperation: this.route.daysOfOperation,
        stops: []
      });

      this.route.stops.forEach(stop => {
        const stopGroup = this.formBuilder.group({});
        this.stops.push(stopGroup);
      })
    }
  }

  get stops(): FormArray {
    return this.form.get('stops') as FormArray;
  }

  addStop() {
    const stopGroup = this.formBuilder.group({
      stopId: [null, Validators.required],
      scheduledDepartureTime: [new Date(), Validators.required]
    })
    this.stops.push(stopGroup);
  }

  removeStop(index: number) {
    this.stops.removeAt(index)
  }

  upStop(index: number) {
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

    const rtData = this.form.value;

    let stops = new Array<Stop>();
    for (let stData of rtData.stops!) {
      let stop: InsertRouteStop = {
        stopId: stData.stopId!,
        scheduledDepartureTime: stData.scheduledDepartureTime!,
      }
    }

    const route: Route = {
      id: this.route?.id ?? 0,
      number: rtData.number!,
      validFrom: rtData.validFrom!,
      validTo: rtData.validTo!,
      daysOfOperation: rtData.daysOfOperation!,
      stops: [], //rtData.stops!,
    }

    if (this.route) {
      this.updateRoute(route);
    } else {
      this.createRoute(route);
    }
  }

  private createRoute(route: Route) {
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

  private updateRoute(route: Route) {
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

  protected readonly stop = stop;
}
