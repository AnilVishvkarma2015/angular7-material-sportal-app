import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { ToastService } from '../../../services/toast.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  regNo: string;
  password: string;

  constructor(private toastService: ToastService, private authService: AuthenticationService, private router: Router, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      regNo: ['', Validators.required],
      password: ['', [
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
    // this.formSubmitAttempt = true;
    // this.loading = true;
    this.authService.login(this.form.value.regNo, this.form.value.password)
      .pipe(first())
      .subscribe(
        loginRes => {
          if (loginRes && loginRes.message) {
            this.toastService.openSnackBar(loginRes.message, '', 'error-snackbar');
            return;
          }
          this.router.navigate(['notifications']);
        },
        err => {
          this.toastService.openSnackBar("Invalid Credentials", '', 'error-snackbar');
          //  this.loading = false;
        });
  }

  forgotPassword() {
    this.router.navigate(['reset-password']);
  }
}
