import { Component, Injectable } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
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
