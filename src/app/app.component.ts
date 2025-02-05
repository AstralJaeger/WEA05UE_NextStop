import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgClass} from '@angular/common';
import {MatIconButton} from '@angular/material/button';
import {Page} from './models/utils';
import {pages} from './pages'

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

  constructor(
    private readonly observer: BreakpointObserver,
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

    this.route.queryParams.subscribe(params => {
      this.returnTo = params[RETURN_URL_PARAM] || '/';
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

  getPages(): Page[] {
    return pages;
  }
}
