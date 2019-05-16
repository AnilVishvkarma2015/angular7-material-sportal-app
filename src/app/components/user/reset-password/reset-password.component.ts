import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  form: FormGroup;
  regNo: string;
  email: string;

  constructor(private userService: UserService, private toastService: ToastService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      regNo: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched)
    );
  }

  onSubmit() {
    this.userService.register(this.form.value)
      .subscribe(users => {
        if (_.isArray(users) && _.isEmpty(users)) {
          this.toastService.openSnackBar('Registration number does not exist.', '', 'error-snackbar');
          return;
        }

        let user = users[0];

        if (user.email !== this.form.value.email) {
          this.toastService.openSnackBar('Email is not registered.', '', 'error-snackbar');
          return;
        }

        this.router.navigate(['create-password'], { queryParams: { id: user._id } });
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }
}
