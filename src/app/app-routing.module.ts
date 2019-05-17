import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from '../app/components/user/register/register.component';
import { CreatePasswordComponent } from './components/user/create-password/create-password.component';
import { LoginComponent } from './components/user/login/login.component';
import { StudentsComponent } from './components/student/students/students.component';
import { AuthGuard } from './core/auth.guard';
import { EnrollStudentsComponent } from './components/student/enroll-students/enroll-students.component';
import { NotificationsComponent } from './components/notification/notifications/notifications.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { SettingsComponent } from './components/setting/settings/settings.component';
import { LeavesComponent } from './components/leave/leaves/leaves.component';
import { ApplyLeaveComponent } from './components/leave/apply-leave/apply-leave.component';
import { CreateNotificationComponent } from './components/notification/create-notification/create-notification.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'create-password',
    component: CreatePasswordComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'students',
    canActivate: [AuthGuard],
    component: StudentsComponent
  },
  {
    path: 'enroll-student',
    canActivate: [AuthGuard],
    component: EnrollStudentsComponent
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard],
    component: NotificationsComponent
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsComponent
  },
  {
    path: 'leaves',
    canActivate: [AuthGuard],
    component: LeavesComponent
  },
  {
    path: 'apply-leave',
    canActivate: [AuthGuard],
    component: ApplyLeaveComponent
  },
  {
    path: 'create-notification',
    canActivate: [AuthGuard],
    component: CreateNotificationComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
