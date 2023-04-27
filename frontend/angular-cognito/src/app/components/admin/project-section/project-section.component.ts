import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../add-project/add-project.component';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AssignProjectformComponent } from '../assign-projectform/assign-projectform.component';
import { D } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-project-section',
  templateUrl: './project-section.component.html',
  styleUrls: ['./project-section.component.css'],
})
export class ProjectSectionComponent implements OnInit {
  displayedColumns: string[] = ['name', 'skill', 'start', 'end', 'status'];
  created!: MatTableDataSource<any>;
  completed!: MatTableDataSource<any>;
  assigned!: MatTableDataSource<any>;
  assignedColumns: string[] = [
    'name',
    'skill',
    'start',
    'end',
    'status',
    'employee',
  ];

  requests: any = [''];
  card: any;
  empty: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  user: User | any;
  ngOnInit(): void {
    this.getCreatedProjects();
    this.getCompletedrojects();
    this.getCompletionRequests();
    this.getAssignedrojects();
  }
  constructor(
    public form: MatDialog,
    public route: Router,
    public api: ApiService
  ) {}

  getCreatedProjects() {
    let status = 'Created';
    this.api.getAllProjects(status).subscribe({
      next: (res) => {
        let a: any;
        a = res;
        this.created = new MatTableDataSource(a);
        this.created.paginator = this.paginator;
        this.created.sort = this.sort;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getCompletedrojects() {
    let status = 'Completed';
    this.api.getAllProjects(status).subscribe({
      next: (res) => {
        let a: any;
        a = res;
        this.completed = new MatTableDataSource(a);
        this.completed.paginator = this.paginator;
        this.completed.sort = this.sort;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getAssignedrojects() {
    let status = 'Assigned';
    this.api.getAllProjects(status).subscribe({
      next: (res) => {
        let a: any;
        a = res;
        this.assigned = new MatTableDataSource(a);
        this.assigned.paginator = this.paginator;
        this.assigned.sort = this.sort;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getCompletionRequests() {
    this.api.getCompletionRequests().subscribe({
      next: (res) => {
        let a: any;
        a = res;

        this.requests = a.Items;
        if (this.requests.length == 0) {
          this.card = null;
          this.empty = 'No completion Requests recieved!';
        } else {
          this.card = a;
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }
  assignUser(data: any) {
    this.form.open(AssignProjectformComponent, {
      width: '50%',
      data: data,
    });
  }
  addForm() {
    this.form.open(AddProjectComponent, {
      width: '50%',
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.created.filter = filterValue.trim().toLowerCase();

    if (this.created.paginator) {
      this.created.paginator.firstPage();
    }
  }

  onApproveCompletionReq(data: any) {
    this.api.approveCompletion(data).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onRejectCompletionReq(data: any) {
    this.api.rejectCompletion(data).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onClick() {
    this.route.navigate(['/admin-home']);
  }
  signOut() {
    this.api.logOut(this.user);
    this.route.navigate(['/login']);
  }
}
