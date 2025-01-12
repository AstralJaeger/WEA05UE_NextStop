import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgIf } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { AuthenticationService } from './services/authentication.service';
import { Page } from './models/pages';

const RETURN_URL_PARAM = 'returnUrl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatIcon,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    MatNavList,
    MatListItem,
    NgIf,
    MatIconButton,
    NgClass,
    RouterLink,
  ],
})
export class AppComponent implements OnInit {
  title = 'NextStop';

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isMobile = true;
  isCollapsed = true;

  returnTo = '';

  pages: Page[] = [
    {
      title: 'Stops',
      icon: 'home',
      route: '/stops',
      authRoles: ['admin'],
    },
    {
      title: 'Routes',
      icon: 'departure_board',
      route: '/routes',
      authRoles: ['admin'],
    },
    {
      title: 'Holidays',
      icon: 'airplanemode_active',
      route: '/holidays',
      authRoles: ['admin'],
    },
    {
      title: 'Stats',
      icon: 'bar_chart',
      route: '/stats',
      authRoles: ['admin', 'user', 'none'],
    },
    {
      title: 'Find Route',
      icon: 'navigation',
      route: '/navigation',
      authRoles: ['admin', 'user', 'none'],
    },
    {
      title: 'Station',
      icon: 'train',
      route: '/station',
      authRoles: ['admin', 'user', 'none'],
    },
  ];

  constructor(
    private readonly observer: BreakpointObserver,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.observer == null) {
      console.error('BreakpointObserver is null');
    }
    this.observer.observe(['(max-width: 800px)']).subscribe(screenSize => {
      this.isMobile = screenSize.matches;
      console.log('isMobile', this.isMobile);
    });
    this.route.queryParams.subscribe(params => {
      this.returnTo = params[RETURN_URL_PARAM] || '/';
    });
  }

  onMenuClick() {
    this.toggleSidenav();
  }

  onLoginClick() {
    console.log('onLoginClick');
    this.auth.login();
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

  getPages(): Page[] {
    const authRole = 'none';
    return this.pages.filter(p => p.authRoles.includes(authRole));
  }
}
