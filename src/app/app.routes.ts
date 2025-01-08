import { Routes } from '@angular/router';
import {NotFoundComponent} from './pages/notfound/not-found/not-found.component';

export const routes: Routes = [
  {
    path: "stops",
    component: NotFoundComponent
  },
  {
    path: "routes",
    component: NotFoundComponent
  },
  {
    path: "holidays",
    component: NotFoundComponent
  },
  {
    path: "stats",
    component: NotFoundComponent
  }
];
