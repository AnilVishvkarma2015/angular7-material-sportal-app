import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  cities: string[] = ['London', 'Newyork', 'Berlin', 'Rome', 'Peris', 'Delhi', 'Mosco'];
  filtersLoaded: Promise<boolean>;

  form: FormGroup;
  id: string;
  firstName: string;
  lastName: string;
  dob: Date;
  regNo: string;
  email: string;
  password: string;
  class: string;
  section: string;
  phone: string;
  city: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastService: ToastService) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loadUser(currentUser._id);
  }

  loadUser(userId) {
    this.userService.getUserById(userId).subscribe(currentUser => {
      if (currentUser !== null && currentUser !== undefined) {
        this.createUserForm(currentUser);
        this.filtersLoaded = Promise.resolve(true);
      }
    });
  }

  createUserForm(currentUser) {
    this.form = this.formBuilder.group({
      id: [currentUser.id],
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      dob: [currentUser.dob, Validators.required],
      regNo: [currentUser.regNo],
      email: [currentUser.email],
      class: [currentUser.class],
      section: [currentUser.section],
      phone: [currentUser.phone, Validators.required],
      city: [currentUser.city, Validators.required],
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

  changePassword() {
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toastService.openSnackBar("Password entered do not match!", '', 'error-snackbar');
      return;
    }

    this.userService.updateUser(this.form.value).add(() => {
      const userId = this.form.value.id;
      this.loadUser(userId);
    });
  }

  onSubmit() {
    let detailsToUpdate = {
      id: this.form.value.id,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      dob: this.form.value.dob,
      phone: this.form.value.phone,
      city: this.form.value.city,
    }

    this.userService.updateUser(detailsToUpdate).add(() => {
      const userId = this.form.value.id;
      this.loadUser(userId);
    });
  }
}
