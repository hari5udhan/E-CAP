import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from 'src/app/models/user';
import { AccountDeleteRequestComponent } from '../../user/dialog/account-delete-request/account-delete-request.component';
import { AccountDeleteComponent } from '../../user/dialog/account-delete/account-delete.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
})
export class EmployeeTableComponent implements OnInit {
  user: User | any;
  displayedColumns: string[] = ['email', 'name', 'sbu', 'sl'];
  dataSource!: MatTableDataSource<any>;
  userList: any[] = [];
  color: any = '#0000';
  @ViewChild(MatSort) sort!: MatSort;
  CognitoUserList: any[] = [];
  CognitoUsername: any;
  data: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selection = new SelectionModel<any>(true, []);

  constructor(
    private api: ApiService,
    private route: Router,
    private form: MatDialog
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('userId');

    if (user) {
      this.user = {} as User;
      this.getAllEmployeeData();
    } else {
      alert('Unauthorized \nLogin to access!');
      this.route.navigate(['/login']);
    }
  }
  getAllEmployeeData = async () => {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        // console.log(res)
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getCognitoUsers();
        this.getEmployee();
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  getCognitoUsers() {
    this.api.getUser().subscribe({
      next: (res) => {
        // console.log(res.Users)
        this.CognitoUserList = res.Users;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onClick() {
    this.route.navigate(['/admin-home']);
  }

  signOut() {
    this.api.logOut(this.user);
    this.route.navigate(['']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(row: any) {
    for (var i = 0; i < this.CognitoUserList.length; i++) {
      if (this.CognitoUserList[i].Attributes[2].Value == row) {
        this.CognitoUsername = this.CognitoUserList[i].Username;
      }
    }
    this.api.getCertifications(row).subscribe({
      next: (res) => {
        this.data.push(this.CognitoUsername);
        this.data.push(res.Count);
        this.data.push(row);
        if (res.Items == 0) {
          this.form.open(AccountDeleteComponent, {
            width: '25%',
            data: this.data,
          });
        } else {
          this.form.open(AccountDeleteRequestComponent, {
            width: '40%',
            data: this.data,
          });
        }
      },
    });
  }
  getEmployee() {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        for (var i = 0; i < res.Count; i++) {
          this.userList.push(res.Items[i].employeeMail);
        }
      },
    });
  }
  onDeleteAll() {
    const count = this.selection.selected.length;
    let i = 0;
    do {
      const user = this.selection.selected[i].employeeMail;
      // console.log(this.selection.selected[i].employeeMail);
      // console.log(this.CognitoUserList.length);
      var k = this.CognitoUserList.length;
      for (var j = 0; j < k; j++) {
        // console.log(j)
        if (this.CognitoUserList[j].Attributes[2].Value == user) {
          this.CognitoUsername = this.CognitoUserList[j].Username;
          console.log(user, '=', this.CognitoUsername);
          break;
        }
      }
      this.api.getCertifications(user).subscribe({
        next: async (res) => {
          if (res.Items.length > 0) {
            for (var i = 0; i < res.Count; i++) {
              await this.api
                .deleteCertification(res.Items[i].certificateId)
                .subscribe({
                  next: (res) => {
                    console.log(res);
                  },
                });
            }
          }
          await this.api.deleteEmployee(user).subscribe({
            next: (res) => {
              console.log(res);
            },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
      i = i + 1;
    } while (i < count);

    if (i == count) {
      window.location.reload();
    }
  }

  onSelect(data: any) {
    console.log(data);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
}
