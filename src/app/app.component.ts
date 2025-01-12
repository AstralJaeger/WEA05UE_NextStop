import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgClass, NgIf} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {AuthenticationService} from './services/authentication.service';
import {Page} from './models/utils';
import {GravatarDirective} from './gravatar.directive';

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
    GravatarDirective,
  ],
})
export class AppComponent implements OnInit {
  title = 'NextStop';

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isMobile = true;
  isCollapsed = true;

  returnTo = '';
  isAuthenticated = false;

  pages: Page[] = [
    {
      title: 'Stops',
      icon: 'home',
      route: '/stops',
      requiresAuthentication: true,
    },
    {
      title: 'Routes',
      icon: 'departure_board',
      route: '/routes',
      requiresAuthentication: true,
    },
    {
      title: 'Holidays',
      icon: 'airplanemode_active',
      route: '/holidays',
      requiresAuthentication: true,
    },
    {
      title: 'Stats',
      icon: 'bar_chart',
      route: '/stats',
      requiresAuthentication: true,
    },
    {
      title: 'Find Route',
      icon: 'navigation',
      route: '/navigation',
      requiresAuthentication: false,
    },
    {
      title: 'Station',
      icon: 'train',
      route: '/station',
      requiresAuthentication: false,
    },
  ];
  userMail: string = '';

  constructor(
    private readonly observer: BreakpointObserver,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    if (this.observer == null) {
      console.error('BreakpointObserver is null');
    }
    this.observer.observe(['(max-width: 800px)']).subscribe(screenSize => {
      this.isMobile = screenSize.matches;
      console.log('isMobile', this.isMobile);
    });

    this.auth.configureAuth().then(() => {
      this.isAuthenticated = this.auth.isAuthenticated();
      this.userMail = this.auth.getUserEmail();
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

  onLogoutClick() {
    console.log('onLogoutClick');
    this.auth.logout();
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
    return this.pages.filter(p => p.requiresAuthentication && this.isAuthenticated || !p.requiresAuthentication);
  }
}
