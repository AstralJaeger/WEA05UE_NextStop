import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgClass, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, MatToolbar, MatIcon, MatSidenavContainer, MatSidenavContent, MatSidenav, MatNavList, MatListItem, NgIf, MatIconButton, NgClass, RouterLink],
})
export class AppComponent implements OnInit {
  title = 'NextStop';

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isMobile = true;
  isCollapsed = true;

  pages: {
    title: string;
    icon: string;
    route: string;
  }[] = [
    {
      title: 'Stops',
      icon: 'home',
      route: '/stops',
    },
    {
      title: 'Routes',
      icon: 'departure_board',
      route: '/routes',
    },
    {
      title: 'Holidays',
      icon: 'edit_location',
      route: '/holidays',
    },
    {
      title: 'Stats',
      icon: 'bar_chart',
      route: '/stats',
    }
  ]

  constructor(private readonly observer: BreakpointObserver) { }

  ngOnInit() {
    if (this.observer == null) {
      console.error('BreakpointObserver is null');
    }
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
      console.log('isMobile', this.isMobile);
    });
  }

  onMenuClick() {
    this.toggleSidenav();
  }

  toggleSidenav() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
