import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Holiday} from '../../../../models/holiday';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {HolidayService} from '../../../../services/holiday.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgIf} from '@angular/common';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-create-holiday-dialog',
  providers: [
    provideNativeDateAdapter()
  ],
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
    ReactiveFormsModule,
    MatError,
    NgIf,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatCheckbox,
  ],
  templateUrl: './holiday-dialog.component.html',
  styleUrl: './holiday-dialog.component.css',
})
export class HolidayDialogComponent implements OnInit {

  @Input()
  holiday: Holiday | null = null;

  @Output()
  holidayChanged = new EventEmitter<Holiday>();

  private readonly dialogRef = inject(MatDialogRef<HolidayDialogComponent>);
  private readonly _snackbar = inject(MatSnackBar);

  private readonly formBuilder = inject(FormBuilder);
  private readonly holidayService = inject(HolidayService);

  readonly form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      schoolholiday: [false, Validators.required],
    },
    {
      validators: this.dateRangeValidator(),
    }
  );

  @Input()
  readonly initialData?: Holiday;

  constructor() {
  }

  ngOnInit() {
    // Prefill the form with data if a stop is provided (update mode).
    if (this.holiday) {
      this.form.setValue({
        name: this.holiday.name,
        startDate: this.holiday.startDate,
        endDate: this.holiday.endDate,
        schoolholiday: this.holiday.isSchoolHoliday,
      });
    }
  }

  dateRangeValidator() {
    return (group: any) => {
      const start = group.get('startDate')?.value;
      const end = group.get('endDate')?.value;

      if (!start || !end) return null;

      const startDate = new Date(start);
      const endDate = new Date(end);

      return startDate > endDate ? {invalidDateRange: true} : null;
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._snackbar.open('Please make sure all fields are valid!', 'Close');
      return;
    }

    const hdData = this.form.value;
    const holiday: Holiday = {
      id: this.holiday?.id ?? 0,
      name: hdData.name!,
      startDate: hdData.startDate!,
      endDate: hdData.endDate!,
      isSchoolHoliday: hdData.schoolholiday!,
    };

    if (this.holiday) {
      this.updateHoliday(holiday);
    } else {
      this.createHoliday(holiday);
    }
  }

  createHoliday(holiday: Holiday) {
    this.holidayService.postHoliday(holiday).subscribe({
      next: () => {
        this._snackbar.open('Holiday created successfully!', 'Close', {
          duration: 3000,
        });
        this.holidayChanged.emit(holiday); // Notify parent about the change
        this.dialogRef.close();
      },
      error: () => {
        this._snackbar.open('Error creating holiday point!', 'Close');
      },
    })
  }

  updateHoliday(holiday: Holiday) {
    this.holidayService.putHoliday(holiday).subscribe({
      next: () => {
        this._snackbar.open('Holiday updated successfully!', 'Close', {
          duration: 3000,
        });
        this.holidayChanged.emit(holiday); // Notify parent about the change
        this.dialogRef.close();
      },
      error: () => {
        this._snackbar.open('Error updating holiday point!', 'Close');
      },
    })
  }
}
