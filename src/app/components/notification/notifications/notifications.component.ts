import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { Notification } from '../../../models/notification.model';
import { NotificationService } from '../../../services/notification.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  displayedColumns = ['category', 'notice', 'actions'];
  dataSource: MatTableDataSource<Notification>;
  notices: Notification[] = [];
  isLoading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private noticeService: NotificationService,
    private toastService: ToastService,
    private router: Router) { }

  ngAfterViewInit() {
    this.loadNotifications();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private loadNotifications() {
    this.noticeService.getNotifications().pipe(
      finalize(() => this.isLoading = false))
      .subscribe(notices => {
        this.dataSource = new MatTableDataSource(notices);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  onCreateNotice() {
    this.router.navigate(['create-notification']);
  }

  onEditNotice(noticeSelected: Notification) {
    this.router.navigate(['create-notification'], { state: noticeSelected });
  }

  onDeleteNotice(noticeSelected: Notification) {
    this.noticeService.deleteNotification(noticeSelected).add(() => {
      this.loadNotifications();
    });
  }
}
