import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../../common/header/header/header.component';
import {Holiday} from '../../../models/holiday';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {CreateHolidayDialogComponent} from '../components/create-holiday-dialog/create-holiday-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {HolidayService} from '../../../services/holiday.service';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-holidays',
  imports: [
    HeaderComponent,
    MatIcon,
    MatFabButton,
    MatTable,
    MatHeaderCell,
    MatCell,
    DatePipe,
    MatPaginator,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatIconButton,
  ],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.css',
})
export class HolidaysComponent implements OnInit, AfterViewInit {
  private readonly _snackBar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      rowType: '',
      cell: (element: Holiday) => `${element.name}`,
    },
    {
      columnDef: 'startDate',
      header: 'Start Date',
      rowType: 'date',
      cell: (element: Holiday) => `${element.startDate}`,
    },
    {
      columnDef: 'endDate',
      header: 'End Date',
      rowType: 'date',
      cell: (element: Holiday) => `${element.endDate}`,
    },
    {
      columnDef: 'type',
      header: 'Type',
      rowType: '',
      cell: (element: Holiday) => `${element.type}`,
    },
    {
      columnDef: 'actions',
      header: 'Actions',
      rowType: 'actions',
      cell: () => '',
    },
  ];
  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(private readonly holidayService: HolidayService) {
  }

  ngOnInit(): void {
    this.fetchHolidays();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private readonly dialog = inject(MatDialog);

  onCreateHolidayBtnClick(): void {
    console.log('onCreateHolidaybtnClick clicked');
    const dialogRef = this.dialog.open(CreateHolidayDialogComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Done adding date');
    });
  }

  fetchHolidays() {
    this.holidayService.getHolidays().subscribe({
      next: v => {
        this.dataSource.data = v;
      },
      error: e => {
        console.error('Error fetching Holidays: ', e);
        this.dataSource.data = [];
        this._snackBar.open('Error fetching Holiday', 'Close');
      },
      complete: () => {
        console.debug('Finished loading Holidays');
      },
    });
  }

  deleteHoliday(holiday: Holiday): void {
    const index = this.dataSource.data.findIndex(h => h.id === holiday.id);
    if (index < 0) {
      return;
    }
    this.holidayService.deleteHoliday(holiday.id).subscribe({
      next: () => {
        console.log('Success');
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = [...this.dataSource.data];
      },
      error: e => {
        console.error(e);
        this._snackBar.open('Error deleting Holiday', 'Close');
      },
    });
  }
}
