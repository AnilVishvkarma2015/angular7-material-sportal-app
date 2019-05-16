import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

import { Notification } from '../models/notification.model';
import { ToastService } from './toast.service';
import { UtilityService } from './utility.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  apiBaseURL = AppConfig.settings.apiServer.baseURL;

  constructor(private http: HttpClient, private toastService: ToastService, private utility: UtilityService, private router: Router) { }

  create(newNotice: Notification) {
    return this.http.post<Notification>(this.apiBaseURL + 'notifications/create', newNotice, this.utility.requestHeaders())
      .subscribe(res => {
        this.toastService.openSnackBar('Notice Posted Successfully', '', 'success-snackbar');
        this.router.navigate(['notifications']);
        return res;
      }, error => {
        this.toastService.openSnackBar('Notice does not posted posted', '', 'error-snackbar');
        throw error;
      });
  }

  getNotifications() {
    return this.http.get<Notification[]>(this.apiBaseURL + 'notifications/').pipe(map(res => {
      return res;
    }));
  }

  getNotificationById(noticeId): any {
    return this.http.get(this.apiBaseURL + 'notifications/' + noticeId).pipe(map(res => {
      return res;
    }));
  };

  updateNotification(updatedNotice: Notification) {
    return this.http.put(this.apiBaseURL + 'notifications/' + updatedNotice.id, updatedNotice)
      .subscribe(res => {
        this.toastService.openSnackBar('Notice Updated Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar(JSON.stringify(error.error.message), '', 'error-snackbar');
        throw error;
      });
  };

  deleteNotification(deletedNotice: Notification) {
    return this.http.delete(this.apiBaseURL + 'notifications/' + deletedNotice.id)
      .subscribe(res => {
        this.toastService.openSnackBar('Notice Deleted Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar(JSON.stringify(error.error.message), '', 'error-snackbar');
        throw error;
      });
  };
}
