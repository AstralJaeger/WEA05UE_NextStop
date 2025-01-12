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
import {StopPoint} from '../../../models/stoppoints';
import {MatPaginator} from '@angular/material/paginator';
import {TableColumnDef} from '../../../models/utils';
import {DatePipe} from '@angular/common';
import {HolidayTypePipePipe} from '../../../pipes/holiday-type-pipe.pipe';
import {StopsService} from '../../../services/stops.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateStoppointDialogComponent} from '../components/create-stoppoint-dialog/create-stoppoint-dialog.component';
import {UpdateStoppointDialogComponent} from '../components/update-stoppoint-dialog/update-stoppoint-dialog.component';

@Component({
  selector: 'app-stops',
  imports: [HeaderComponent, MatFabButton, MatIcon, DatePipe, HolidayTypePipePipe, MatCell, MatCellDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatIconButton, MatPaginator, MatRow, MatRowDef, MatTable, MatColumnDef, MatHeaderCellDef],
  templateUrl: './stops.component.html',
  styleUrl: './stops.component.css',
})
export class StopsComponent implements OnInit {
  private readonly createDialog = inject(MatDialog);
  private readonly updateDialog = inject(MatDialog);

  private readonly _snackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<StopPoint>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns: TableColumnDef<StopPoint>[] = [
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
        if (element?.location.latitude && element.location?.longitude) {
          return `${element.location.latitude?.toFixed(4)}, ${element.location.longitude?.toFixed(4)}`
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
    const dialogRef = this.createDialog.open(CreateStoppointDialogComponent, {
      data: {},
    });
    dialogRef.afterClosed()
      .subscribe(() => console.log("Done."))
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

  deleteStop(stopPoint: StopPoint) {
    const index = this.dataSource.data.findIndex(sp => sp.id == stopPoint.id);
    if (index < 0) return;
    this.stopsService.deleteStopPoint(stopPoint.id).subscribe({
      next: () => {
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = [...this.dataSource.data]; // trigger reload
      },
      error: e => {
        console.error("error deleting stoppoint: ", e)
        this._snackBar.open("Error deleting Stop", 'Close')
      }
    })
  }

  updateStop(stopPoint: StopPoint) {
    const dialogRef = this.updateDialog.open(UpdateStoppointDialogComponent, {
      data: {stopPointId: stopPoint.id},
    });
    dialogRef.afterClosed()
      .subscribe(() => console.log("Done."))
  }
}
