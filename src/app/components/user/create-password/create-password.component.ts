import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';

import { UserService } from '../../../services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent {
  form: FormGroup;
  id: string;
  password: string;
  confirmPassword: string;
  user: Params;
  isNewForm: Observable<boolean>;

  constructor(private userService: UserService, private toastService: ToastService, private router: Router, private formBuilder: FormBuilder, ) {
    this.user = this.router.getCurrentNavigation().extras.queryParams;
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      id: [this.user.id],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(8)
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
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toastService.openSnackBar("Password entered do not match!", '', 'error-snackbar');
      return;
    }

    this.userService.updateUser(this.form.value);
    this.isNewForm = observableOf(false);
  }
}
