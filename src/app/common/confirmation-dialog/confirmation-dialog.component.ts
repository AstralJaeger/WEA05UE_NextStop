import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    MatDialogTitle,
    MatButton
  ],
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  readonly title: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; onConfirm: () => void; onCancel: () => void },
    private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.title = data.title;
    this.onConfirm = data.onConfirm;
    this.onCancel = data.onCancel;
  }

  confirm(): void {
    this.onConfirm();
    this.dialogRef.close();
  }

  cancel(): void {
    this.onCancel();
    this.dialogRef.close();
  }
}
