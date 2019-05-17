import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Notification } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notification.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notices: Notification[] = [];
  isLoading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdmin: Observable<boolean>;

  constructor(
    private noticeService: NotificationService,
    private toastService: ToastService,
    private router: Router) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isAdmin = currentUser.isAdmin;
  }

  ngAfterViewInit() {
    this.loadNotifications();
  }

  private loadNotifications() {
    this.noticeService.getNotifications().pipe(
      finalize(() => this.isLoading = false))
      .subscribe(notices => {
        this.notices = notices;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  onNewNotice() {
    this.router.navigate(['create-notification']);
  }
}
