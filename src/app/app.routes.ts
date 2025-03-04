import {Routes} from '@angular/router';
import {NotFoundComponent} from './pages/notfound/not-found/not-found.component';
import {StatsComponent} from './pages/stats/stats/stats.component';
import {HolidaysComponent} from './pages/holiday/holidays/holidays.component';
import {RoutesComponent} from './pages/routes/routes/routes.component';
import {StopsComponent} from './pages/stops/stops/stops.component';
import {NavigationComponent} from './pages/navigation/navigation/navigation.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
  },
  {
    path: 'navigation',
    component: NavigationComponent,
  },
  {
    path: 'stops',
    component: StopsComponent,
  },
  {
    path: 'routes',
    component: RoutesComponent,
  },
  {
    path: 'holidays',
    component: HolidaysComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  // Catch-all route
  {
    path: '**',
    component: NotFoundComponent,
  },
];
