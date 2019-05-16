import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import { Register } from '../models/register.model';
import { ToastService } from './toast.service';
import { UtilityService } from './utility.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiBaseURL = AppConfig.settings.apiServer.baseURL;

  constructor(private http: HttpClient, private toastService: ToastService, private utility: UtilityService, private router: Router) { }

  register(newRegistration: Register) {
    return this.http.post<Register>(this.apiBaseURL + 'users/getByRegNo', newRegistration, this.utility.requestHeaders())
      .pipe(map(res => {
        return res;
      }));
  }

  enrollUser(newUser: User) {
    return this.http.post(this.apiBaseURL + 'users/register', newUser, this.utility.requestHeaders())
      .subscribe(res => {
        this.toastService.openSnackBar('Student Enrolled Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar('Registration No/Email already registered', '', 'error-snackbar');
        // this.router.navigate(['register']);
        throw error;
      });
  }

  getUsers() {
    return this.http.get<User[]>(this.apiBaseURL + 'users/').pipe(map(res => {
      return res;
    }));
  }

  getUserById(userId): any {
    return this.http.get(this.apiBaseURL + 'users/' + userId).pipe(map(res => {
      return res;
    }));
  };

  updateUser(updatedUser: any) {
    return this.http.put(this.apiBaseURL + 'users/' + updatedUser.id, updatedUser)
      .subscribe(res => {
        this.toastService.openSnackBar('User Updated Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar(JSON.stringify(error.error.message), '', 'error-snackbar');
        throw error;
      });
  };

  deleteUser(deleteUser: User) {
    return this.http.delete(this.apiBaseURL + 'users/' + deleteUser.id)
      .subscribe(res => {
        this.toastService.openSnackBar('User Deleted Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar(JSON.stringify(error.error.message), '', 'error-snackbar');
        throw error;
      });
  };
}
