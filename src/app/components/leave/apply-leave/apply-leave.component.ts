import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Leave } from 'src/app/models/leave.model';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent {
  leave: Leave;
  reasons: string[] = ['Not Well', 'Out of station', 'Family Obligation', 'Festival Celebration', 'Personal'];
  statuses: string[] = ['Pending', 'Approved', 'Rejected'];
  submitType: string;
  formType: string;
  isAdmin: Observable<boolean>;

  form: FormGroup;
  id: string;
  reason: string;
  startDate: Date;
  endDate: Date;
  regNo: string;
  days: Number;
  status: string;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private leaveService: LeaveService) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.regNo = currentUser.regNo;
    this.isAdmin = currentUser.isAdmin;

    let dto = this.router.getCurrentNavigation().extras.state;

    if (!dto || dto == undefined || dto === null) {
      this.applyNewLeave();
    } else if (dto.status === "Approved") {
      this.editApprovedLeave(dto, true);
    } else {
      this.editAppliedLeave(dto, this.isAdmin);
    }
  }

  private applyNewLeave() {
    this.submitType = 'APPLY';
    this.formType = 'Apply New Leave';
    this.form = this.formBuilder.group({
      id: [''],
      reason: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      regNo: [{ value: this.regNo, disabled: true }],
      days: ['', Validators.required],
      status: [{ value: 'Pending', disabled: !this.isAdmin }]
    });
  }

  private editAppliedLeave(leaveToEdit, isDisable) {
    this.submitType = 'UPDATE';
    this.formType = 'Edit Leave';
    this.form = this.formBuilder.group({
      id: [leaveToEdit.id],
      reason: [{ value: leaveToEdit.reason, disabled: isDisable }],
      startDate: [{ value: leaveToEdit.startDate, disabled: isDisable }],
      endDate: [{ value: leaveToEdit.endDate, disabled: isDisable }],
      regNo: [{ value: leaveToEdit.regNo, disabled: true }],
      days: [{ value: leaveToEdit.days, disabled: isDisable }],
      status: [{ value: leaveToEdit.status, disabled: !isDisable }],
    });
  }

  private editApprovedLeave(leaveToEdit, isDisable) {
    this.submitType = 'UPDATE';
    this.formType = 'Edit Leave';
    this.form = this.formBuilder.group({
      id: [leaveToEdit.id],
      reason: [{ value: leaveToEdit.reason, disabled: isDisable }],
      startDate: [{ value: leaveToEdit.startDate, disabled: isDisable }],
      endDate: [{ value: leaveToEdit.endDate, disabled: isDisable }],
      regNo: [{ value: leaveToEdit.regNo, disabled: true }],
      days: [{ value: leaveToEdit.days, disabled: isDisable }],
      status: [{ value: leaveToEdit.status, disabled: isDisable }],
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
      this.leaveService.updateLeave(this.form.getRawValue()).add(() => {
        this.router.navigate(['leaves']);
      });
    } else {
      this.leaveService.create(this.form.getRawValue()).add(() => {
        this.router.navigate(['leaves']);
      });
    }
  }
}
