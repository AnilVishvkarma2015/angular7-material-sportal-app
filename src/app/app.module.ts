import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';

import { AppConfig } from '../app/config/app.config';
import { AppMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RegisterComponent } from './components/user/register/register.component';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { CreatePasswordComponent } from './components/user/create-password/create-password.component';
import { LoginComponent } from './components/user/login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptor } from './core/jwt.interceptor';
import { StudentsComponent } from './components/student/students/students.component';
import { EnrollStudentsComponent } from './components/student/enroll-students/enroll-students.component';
import { AuthGuard } from './core/auth.guard';
import { NotificationsComponent } from './components/notification/notifications/notifications.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { SettingsComponent } from './components/setting/settings/settings.component';
import { LeavesComponent } from './components/leave/leaves/leaves.component';
import { ApplyLeaveComponent } from './components/leave/apply-leave/apply-leave.component';
import { CreateNotificationComponent } from './components/notification/create-notification/create-notification.component';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    CreatePasswordComponent,
    LoginComponent,
    StudentsComponent,
    EnrollStudentsComponent,
    NotificationsComponent,
    ResetPasswordComponent,
    SettingsComponent,
    LeavesComponent,
    ApplyLeaveComponent,
    CreateNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    GlobalErrorHandlerService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    AuthGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
