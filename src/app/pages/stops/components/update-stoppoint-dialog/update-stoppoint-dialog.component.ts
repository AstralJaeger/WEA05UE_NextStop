import {Component, inject, Input, OnInit} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {StopPoint, StopPointForUpdate} from '../../../../models/stoppoints';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StopsService} from '../../../../services/stops.service';
import {numberInRangeValidator} from '../../../../common/validators/NumberInRangeValidator';

@Component({
  selector: 'app-update-stoppoint-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './update-stoppoint-dialog.component.html',
  styleUrl: './update-stoppoint-dialog.component.css'
})
export class UpdateStoppointDialogComponent implements OnInit {

  protected readonly dialogRef = inject(MatDialogRef<UpdateStoppointDialogComponent>);
  protected readonly data = inject<{ stopPointId: number }>(MAT_DIALOG_DATA);
  private readonly _snackbar = inject(MatSnackBar);

  @Input()
  protected readonly stopPointId: number | null = this.data?.stopPointId || null

  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      latitude: [0.0, [Validators.required, numberInRangeValidator(-90, 90)]],
      longitude: [0.0, [Validators.required, numberInRangeValidator(-90, 90)]],
    },
  );

  constructor(private readonly stopsService: StopsService) {
  }

  ngOnInit() {
    this.fetchStoppoint();
  }

  fetchStoppoint() {
    if (this.noEnsureStopPointId()) return;

    this.stopsService.getStopPointById(this.stopPointId!).subscribe({
      next: (sp) => {
        // Update the form with the fetched data
        this.form.setValue({
          name: sp.name || '',          // Ensure fallback in case the value is null/undefined
          shortName: sp.shortName || '',
          latitude: sp.location.latitude || 0.0,
          longitude: sp.location.longitude || 0.0,
        });
      },
      error: (error) => {
        console.error("Error fetching stoppoint", error);
        // Handle the error as needed, such as showing a user-friendly error message
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.noEnsureStopPointId()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Form Errors: ', this.form.errors);
      this._snackbar.open('Please make sure all fields are valid!', 'Close');
      return;
    }

    if (this.form.valid) {
      const spData = this.form.value;
      const sp: StopPointForUpdate = {
        name: spData.name ? spData.name : '',
        shortName: spData.shortName ? spData.shortName : '',
        location: {
          latitude: spData.latitude ? spData.latitude : 0.0,
          longitude: spData.longitude ? spData.longitude : 0.0,
        },
      }
      this.stopsService.putStopPoint(this.stopPointId!, sp).subscribe({
        next: v => this.dialogRef.close(v),
        error: e => {
          console.error('Failed to create stoppoint:', e);
          const snackbarRef = this._snackbar.open('Error creating stop', 'Close');
          snackbarRef.afterDismissed().subscribe(() => this.dialogRef.close());
        }
      })
    }
  }

  noEnsureStopPointId() {
    if (this.stopPointId == null) {
      this.form.markAllAsTouched();
      console.error('StopPointId is null!');
      const snRef = this._snackbar.open('Critical error!!', 'Close');
      snRef.afterDismissed().subscribe(() => this.dialogRef.close())
      return false;
    }
    return true
  }
}
