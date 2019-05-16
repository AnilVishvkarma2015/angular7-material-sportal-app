import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  displayedColumns = ['firstName', 'regNo', 'class', 'section', 'phone', 'actions'];
  dataSource: MatTableDataSource<User>;
  Users: User[] = [];
  isLoading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private router: Router) { }

  ngAfterViewInit() {
    this.loadUsers();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private loadUsers() {
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading = false))
      .subscribe(users => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  onEnrollNewStudent() {
    this.router.navigate(['enroll-student']);
  }

  onEditStudent(studentSelected: User) {
    this.router.navigate(['enroll-student'], { state: studentSelected });
  }

  onDeleteStudent(studentSelected: User) {
    this.userService.deleteUser(studentSelected).add(() => {
      this.loadUsers();
    });
  }
}
