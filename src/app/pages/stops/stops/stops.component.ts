import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../../common/header/header/header.component';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Stop} from '../../../models/stoppoints';
import {MatPaginator} from '@angular/material/paginator';
import {TableColumnDef} from '../../../models/utils';
import {DatePipe} from '@angular/common';
import {StopsService} from '../../../services/stops.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '../../../common/confirmation-dialog/confirmation-dialog.component';
import {StopDialogComponent} from '../components/stop-dialog/stop-dialog.component';

@Component({
  selector: 'app-stops',
  imports: [HeaderComponent, MatFabButton, MatIcon, DatePipe, MatCell, MatCellDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIconButton, MatPaginator, MatRow, MatRowDef, MatTable, MatColumnDef, MatHeaderCellDef],
  templateUrl: './stops.component.html',
  styleUrl: './stops.component.css',
})
export class StopsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);

  private readonly _snackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<Stop>([]);

  @ViewChild(MatPaginator)
  readonly paginator!: MatPaginator;

  columns: TableColumnDef<Stop>[] = [
    {
      columnDef: "name",
      header: "Name",
      rowType: "",
      cell: element => `${element.name}`
    },
    {
      columnDef: "shortName",
      header: "Short",
      rowType: "",
      cell: element => `${element.shortName}`
    },
    {
      columnDef: "coordinates",
      header: "Coordinates",
      rowType: "",
      cell: element => {
        if (element?.latitude && element.longitude) {
          return `${element.latitude.toFixed(4)}, ${element.longitude.toFixed(4)}`
        }
        return '';
      }
    },
    {
      columnDef: "action",
      header: "Action",
      rowType: "actions",
      cell: element => ``
    },
  ]
  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(private readonly stopsService: StopsService) {
  }

  ngOnInit() {
    this.fetchStops()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onCreateStopBtnClick() {
    console.log("OnCreateStop")
    const dialogRef = this.dialog.open(StopDialogComponent, {
      data: {},
    });
    dialogRef.componentInstance.stopChanged.subscribe(() => this.fetchStops());
  }

  fetchStops() {
    this.stopsService.getStopPoints().subscribe({
        next: v => {
          this.dataSource.data = v;
        },
        error: e => {
          console.error("Error fetching stops: ", e)
          this.dataSource.data = [];
          this._snackBar.open("Error fetching stops", "Close")
        }
      }
    )
  }

  updateStop(stop: Stop) {
    console.log("OnUpdateStop")
    const dialogRef = this.dialog.open(StopDialogComponent, {
      data: {stop},
    });

    const instance = dialogRef.componentInstance;
    instance.stop = stop;
    instance.stopChanged.subscribe(() => this.fetchStops());
  }
}
