import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {StopPoint} from '../../../../models/stoppoints';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {StopsService} from '../../../../services/stops.service';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {numberInRangeValidator} from '../../../../common/validators/NumberInRangeValidator';

@Component({
  selector: 'app-create-stoppoint-dialog',
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
    NgIf
  ],
  templateUrl: './create-stoppoint-dialog.component.html',
  styleUrl: './create-stoppoint-dialog.component.css'
})
export class CreateStoppointDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<CreateStoppointDialogComponent>);
  protected readonly data = inject<StopPoint>(MAT_DIALOG_DATA);
  private readonly _snackbar = inject(MatSnackBar);

  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      latitude: [0.0, [Validators.required, numberInRangeValidator(-90, 90)]],
      longitude: [0.0, [Validators.required, numberInRangeValidator(-180, 180)]],
    },
  );

  constructor(private readonly stopsService: StopsService) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Form Errors: ', this.form.errors);
      this._snackbar.open('Please make sure all fields are valid!', 'Close');
      return;
    }
    if (this.form.valid) {
      const spData = this.form.value;
      const sp: StopPoint = {
        id: 0,
        name: spData.name ? spData.name : '',
        shortName: spData.shortName ? spData.shortName : '',
        location: {
          latitude: spData.latitude ? spData.latitude : 0.0,
          longitude: spData.longitude ? spData.longitude : 0.0,
        },
      }
      this.stopsService.postStopPoint(sp).subscribe({
        next: v => this.dialogRef.close(v),
        error: e => {
          console.error('Failed to create stoppoint:', e);
          const snackbarRef = this._snackbar.open('Error creating stop', 'Close');
          snackbarRef.afterDismissed().subscribe(() => this.dialogRef.close());
        }
      })
    }
  }


}
