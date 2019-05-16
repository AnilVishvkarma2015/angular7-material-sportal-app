import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isUserLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  currentUser: Observable<string>;
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private breakpointObserver: BreakpointObserver, public authService: AuthenticationService) {
    this.isUserLoggedIn = authService.isUserLoggedIn();
    this.isAdmin = authService.isAdmin();
    this.currentUser = authService.currentUser();
  }

  onLogout() {
    this.authService.logout();
  }
}
