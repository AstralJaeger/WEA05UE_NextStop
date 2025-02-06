import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../../common/header/header/header.component';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouteDialogComponent} from '../components/route-dialog/route-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Route} from '../../../models/route';
import {MatPaginator} from '@angular/material/paginator';
import {RoutesService} from '../../../services/routes.service';
import {StopsService} from '../../../services/stops.service';
import {TableColumnDef} from '../../../models/utils';
import {Stop} from '../../../models/stoppoints';
import {ConfirmationDialogComponent} from '../../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-routes',
  imports: [HeaderComponent, MatFabButton, MatIcon, MatTable, MatPaginator, MatHeaderRow, MatRow, MatColumnDef, MatHeaderCell, MatCell, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, MatIconButton],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css',
})
export class RoutesComponent implements OnInit, AfterViewInit {

  private readonly dialog = inject(MatDialog);

  private readonly _snackbar = inject(MatSnackBar);
  dataSource = new MatTableDataSource<Route>([]);

  private readonly stopsCache: Map<number, Stop> = new Map<number, Stop>();

  @ViewChild(MatPaginator)
  readonly paginator!: MatPaginator;

  columns: TableColumnDef<Route>[] = [
    {
      columnDef: "number",
      header: "Number",
      rowType: "num",
      cell: element => element.number,
    },
    {
      columnDef: "valid",
      header: "Valid",
      rowType: "validity",
      cell: element => `${element.validFrom} - ${element.validTo}`,
    },
    {
      columnDef: "days_of_operation",
      header: "Days Of Operation",
      rowType: "operation",
      cell: element => `${element.daysOfOperation.split(',').join(', ')}`,
    },
    {
      columnDef: "start_stop",
      header: "Start",
      rowType: "start",
      cell: element => {
        if (element.stops.length >= 1) {
          const start = element.stops.reduce((min, stop) => stop.sequenceNumber < min.sequenceNumber ? stop : min);
          if (this.stopsCache.has(start.stopId)) {
            return this.stopsCache.get(start.stopId)!.name;
          }
          return `${start.stopId}`;
        }
        return 'No Stops';
      },
    },
    {
      columnDef: "end_stop",
      header: "Destination",
      rowType: "destination",
      cell: element => {
        if (element.stops.length >= 1) {
          const destination = element.stops.reduce((max, stop) => stop.sequenceNumber > max.sequenceNumber ? stop : max)
          if (this.stopsCache.has(destination.stopId)) {
            return this.stopsCache.get(destination.stopId)!.name
          }
          return `${destination.stopId}`
        }
        return 'No Stops'
      },
    },
    {
      columnDef: "actions",
      header: "Actions",
      rowType: "actions",
      cell: element => '',
    }
  ]
  displayedColumns = this.columns.map(c => c.columnDef);

  constructor(private readonly routesService: RoutesService, private readonly stopsService: StopsService) {
  }

  ngOnInit() {
    this.fetchRoutes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onCreateRouteBtnClick() {
    const dialogRef = this.dialog.open(RouteDialogComponent, {
      data: {}
    });
    dialogRef.componentInstance.routeChanged.subscribe(() => this.fetchRoutes());
  }

  fetchRoutes() {
    this.routesService.getRoutes().subscribe({
      next: (v) => {
        this.dataSource.data = v;
        for (let data of this.dataSource.data) {
          for (let routestop of data.stops) {
            this.stopsService.getStopPointById(routestop.stopId).subscribe({
              next: value => {
                this.stopsCache.set(routestop.stopId, value);
              },
              error: err => {
                console.warn('error fetching stop', err)
              }
            })
          }
        }
      },
      error: e => {
        console.error("error fetching rotues: ", e);
        this.dataSource.data = [];
        this._snackbar.open("Error fetching routes", "Close", {
          duration: 5000
        });
      }
    })
  }

  updateRoute(route: Route) {
    const dialogRef = this.dialog.open(RouteDialogComponent, {
      data: {route}
    });
    dialogRef.componentInstance.routeChanged.subscribe(() => this.fetchRoutes());
  }

  deleteRoute(route: Route) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Are you sure you would like to delete route ${route.number}?`,
        onConfirm: () => {
          const index = this.dataSource.data.findIndex(r => r.id === route.id);
          if (index < 0) {
            return;
          }
          this.routesService.deleteRoute(route).subscribe({
            next: () => {
              console.log('Success');
              this.fetchRoutes();
            },
            error: e => {
              console.warn('Deleting Route entities is not implemented in the backend, Npgsql.PostgresException error is expected.')
              console.error(e);
              this._snackbar.open(`Error deleting route ${route.number}`, 'Close');
            },
          });
        },
        onCancel: () => {
          console.log(`User cancelled delete action`)
        }
      }
    });

  }

}
