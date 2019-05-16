import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';
import { Leave } from 'src/app/models/leave.model';
import { LeaveService } from 'src/app/services/leave.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent {
  displayedColumns = ['reason', 'startDate', 'endDate', 'days', 'status', 'actions'];
  dataSource: MatTableDataSource<Leave>;
  leaves: Leave[] = [];
  isLoading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdmin: Observable<boolean>;
  regNo: string;

  constructor(
    private leaveService: LeaveService,
    private toastService: ToastService,
    private router: Router) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.regNo = currentUser.regNo;
    this.isAdmin = currentUser.isAdmin;
  }

  ngAfterViewInit() {
    if (this.isAdmin) {
      this.loadLeaves();
    } else {
      this.loadMyLeaves(this.regNo);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  convertDateFormat(dateToConvert) {
    var converteddate = new Date(dateToConvert),
      month = ("0" + (converteddate.getMonth() + 1)).slice(-2),
      day = ("0" + converteddate.getDate()).slice(-2);
    return [converteddate.getFullYear(), month, day].join("-");
  }

  private loadLeaves() {
    this.leaveService.getLeaves().pipe(
      finalize(() => this.isLoading = false))
      .subscribe(leaves => {
        leaves.forEach(element => {
          element.startDate = this.convertDateFormat(element.startDate);
          element.endDate = this.convertDateFormat(element.endDate);
        });

        this.dataSource = new MatTableDataSource(leaves);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  private loadMyLeaves(regNo) {
    this.leaveService.getLeaveByRegNo(regNo).pipe(
      finalize(() => this.isLoading = false))
      .subscribe(leaves => {
        leaves.forEach(element => {
          element.startDate = this.convertDateFormat(element.startDate);
          element.endDate = this.convertDateFormat(element.endDate);
        });

        this.dataSource = new MatTableDataSource(leaves);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  onApplyLeave() {
    this.router.navigate(['apply-leave']);
  }

  onEditLeave(leaveSelected: Leave) {
    this.router.navigate(['apply-leave'], { state: leaveSelected });
  }

  onDeleteLeave(leaveSelected: Leave) {
    this.leaveService.deleteLeave(leaveSelected).add(() => {
      this.loadLeaves();
    });
  }
}
