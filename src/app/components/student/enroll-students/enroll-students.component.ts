import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { Router } from '@angular/router';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-enroll-students',
  templateUrl: './enroll-students.component.html',
  styleUrls: ['./enroll-students.component.css']
})
export class EnrollStudentsComponent {
  user: User;
  cities: string[] = ['London', 'Newyork', 'Berlin', 'Rome', 'Peris', 'Delhi', 'Mosco'];
  classes: string[] = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  sections: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  submitType: string;
  formType: string;

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
  isActive: boolean;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService) {

    let dto = this.router.getCurrentNavigation().extras.state;

    if (!dto || dto == undefined || dto === null) {
      this.enrollNewStudent();
    } else {
      this.editEnrolledStudent(dto);
    }
  }

  private enrollNewStudent() {
    this.submitType = 'SAVE';
    this.formType = 'Enroll New Student';
    this.form = this.formBuilder.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: [Date.now(), Validators.required],
      regNo: [Date.now(), Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]],
      password: [''],
      class: ['', Validators.required],
      section: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      isActive: [true]
    });
  }

  private editEnrolledStudent(userToEdit) {
    this.submitType = 'UPDATE';
    this.formType = 'Edit Student';
    this.form = this.formBuilder.group({
      id: [userToEdit.id],
      firstName: [userToEdit.firstName, Validators.required],
      lastName: [userToEdit.lastName, Validators.required],
      dob: [userToEdit.dob, Validators.required],
      regNo: [userToEdit.regNo, Validators.required],
      email: [userToEdit.email, [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]],
      class: [userToEdit.class, Validators.required],
      section: [userToEdit.section, Validators.required],
      phone: [userToEdit.phone, Validators.required],
      city: [userToEdit.city, Validators.required],
      isActive: [userToEdit.isActive]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched)
    );
  }

  onSubmit() {
    if (this.form.value.id && this.form.value.id !== null && this.form.value.id !== undefined) {
      this.userService.updateUser(this.form.value).add(() => {
        this.router.navigate(['students']);
      });
    } else {
      this.userService.enrollUser(this.form.value).add(() => {
        this.router.navigate(['students']);
      });
    }
  }

  onChange() {
    console.log(this.form.value.isActive);
  }
}
