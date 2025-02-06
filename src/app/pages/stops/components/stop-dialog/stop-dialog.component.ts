import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {
  MatDialogActions, MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {Stop} from '../../../../models/stoppoints';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {StopsService} from '../../../../services/stops.service';
import {numberInRangeValidator} from '../../../../common/validators/NumberInRangeValidator';
import {MatIcon} from '@angular/material/icon';
import {MatFormField, MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-stop-dialog',
  templateUrl: './stop-dialog.component.html',
  styleUrls: ['./stop-dialog.component.css'],
  imports: [
    MatIcon,
    MatDialogActions,
    MatError,
    MatFormField,
    MatDialogContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatDialogTitle
  ]
})
export class StopDialogComponent implements OnInit {

  @Input()
  stop: Stop | null = null;

  @Output()
  stopChanged = new EventEmitter<Stop>();

  protected readonly dialogRef = inject(MatDialogRef<StopDialogComponent>);
  private readonly _snackbar = inject(MatSnackBar);

  formBuilder = inject(FormBuilder);
  private readonly stopsService = inject(StopsService);

  public readonly form = this.formBuilder.group({
    name: ['', Validators.required],
    shortName: ['', Validators.required],
    latitude: [0.0, [Validators.required, numberInRangeValidator(-90, 90)]],
    longitude: [0.0, [Validators.required, numberInRangeValidator(-180, 180)]],
  });

  constructor() {
  }

  ngOnInit(): void {
    // Prefill the form with data if a stop is provided (update mode).
    if (this.stop) {
      this.form.setValue({
        name: this.stop.name,
        shortName: this.stop.shortName,
        latitude: this.stop.latitude,
        longitude: this.stop.longitude,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._snackbar.open('Please ensure all fields are valid!', 'Close');
      return;
    }

    const spData = this.form.value;
    const stopPoint: Stop = {
      id: this.stop?.id ?? 0, // Use the existing ID if updating, otherwise default to 0
      name: spData.name!,
      shortName: spData.shortName!,
      latitude: spData.latitude!,
      longitude: spData.longitude!,
    };

    // Perform create or update based on whether the input `stop` was provided
    if (this.stop) {
      this.updateStopPoint(stopPoint);
    } else {
      this.createStopPoint(stopPoint);
    }
  }

  private createStopPoint(stop: Stop): void {
    this.stopsService.postStopPoint(stop).subscribe({
      next: () => {
        this._snackbar.open('Stop created successfully!', 'Close', {
          duration: 3000,
        });
        this.stopChanged.emit(stop); // Notify parent about the change
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Failed to create stop!', err);
        this._snackbar.open('Error creating stop!', 'Close', {
          duration: 3000
        });
      },
    });
  }

  private updateStopPoint(stop: Stop): void {
    this.stopsService.putStopPoint(stop.id, stop).subscribe({
      next: () => {
        this._snackbar.open('Stop updated successfully!', 'Close', {
          duration: 3000,
        });
        this.stopChanged.emit(stop); // Notify parent about the change
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('Failed to update stop!', err);
        this._snackbar.open('Error updating stop!', 'Close');
      },
    });
  }
}
