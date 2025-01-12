import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Holiday, HolidayTypes } from '../../../../models/holiday';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { HolidayService } from '../../../../services/holiday.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-holiday-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatDialogTitle,
    FormsModule,
    MatNativeDateModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatError,
    NgIf,
  ],
  templateUrl: './create-holiday-dialog.component.html',
  styleUrl: './create-holiday-dialog.component.css',
})
export class CreateHolidayDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateHolidayDialogComponent>);
  readonly data = inject<Holiday>(MAT_DIALOG_DATA);

  private readonly _snackBar = inject(MatSnackBar);

  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      type: [null, Validators.required],
    },
    {
      validators: this.dateRangeValidator(),
    }
  );

  protected readonly HolidayTypes = HolidayTypes;

  constructor(private readonly holidayService: HolidayService) {}

  dateRangeValidator() {
    return (group: any) => {
      const start = group.get('startDate')?.value;
      const end = group.get('endDate')?.value;
      return start && end && new Date(start) > new Date(end) ? { invalidDateRange: true } : null;
    };
  }

  onCancel(): void {
    console.log('CreateHolidayDialog::onCancel');
    this.dialogRef.close();
  }

  onConfirm(): void {
    console.log('CreateHolidayDialog::onConfirm');
    console.log('Form Value: ', this.form.value);
    console.log('Form Valid: ', this.form.valid);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Form Errors: ', this.form.errors);
      this._snackBar.open('Please make sure all fields are valid!', 'Close');
      return;
    }

    if (this.form.valid) {
      const holidayData = this.form.value;
      const holiday: Holiday = {
        id: 0,
        name: holidayData.name ? holidayData.name : '',
        startDate: holidayData.startDate ? new Date(holidayData.startDate) : new Date(),
        endDate: holidayData.endDate ? new Date(holidayData.endDate) : new Date(),
        type: holidayData.type ? holidayData.type : 'Other',
      };
      this.holidayService.postHoliday(holiday).subscribe({
        next: v => {
          this.dialogRef.close(v);
        },
        error: e => {
          console.error('Failed to create holiday:', e);
          const snackbarRef = this._snackBar.open('Error creating holiday', 'Close');
          snackbarRef.afterDismissed().subscribe(() => this.dialogRef.close());
        },
        complete: () => console.debug('Done creating holiday'),
      });
    }
  }
}
