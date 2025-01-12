import { Component } from '@angular/core';
import { HeaderComponent } from '../../../common/header/header/header.component';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-routes',
  imports: [HeaderComponent, MatFabButton, MatIcon],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css',
})
export class RoutesComponent {}
