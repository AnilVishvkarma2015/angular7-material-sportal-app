import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as jwt_decode from 'jwt-decode';

import { AppConfig } from '../config/app.config';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    userAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    isAdminSubject = new BehaviorSubject<boolean>(this.hasAdmin());
    currentUserSubject = new BehaviorSubject<string>(this.hasCurrentUser());
    apiBaseURL = AppConfig.settings.apiServer.baseURL;

    constructor(private http: HttpClient, private router: Router, private toastService: ToastService) { }

    private hasToken(): boolean {
        console.log(localStorage.getItem('currentUser'));
        return !!localStorage.getItem('currentUser');
    }

    isUserLoggedIn(): Observable<boolean> {
        return this.userAuthenticatedSubject.asObservable();
    }

    private hasCurrentUser(): string {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')).firstName;
        }
        return;
    }

    currentUser(): Observable<string> {
        return this.currentUserSubject.asObservable();
    }

    private hasAdmin(): boolean {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')).isAdmin;
        }
        return;
    }

    isAdmin(): Observable<boolean> {
        return this.isAdminSubject.asObservable();
    }

    getToken() {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser')).token;
        }
        return;
    }

    getDecodedToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    getTokenExpirationDate(token: string): Date {
        const decodedToken = this.getDecodedToken(token);
        if (decodedToken.exp === undefined) return null;
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);
        return date;
    }

    isTokenExpired(): boolean {
        var token = this.getToken();
        if (!token) return true;

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    login(regNo: string, password: string) {
        return this.http.post<any>(this.apiBaseURL + 'users/authenticate', { regNo: regNo, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.userAuthenticatedSubject.next(true);
                    this.isAdminSubject.next(user.isAdmin);
                    this.currentUserSubject.next(user.firstName);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.userAuthenticatedSubject.next(false);
        this.isAdminSubject.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
        this.toastService.openSnackBar("You have been Logout Successfully!", '', "success-snackbar");
    }
}