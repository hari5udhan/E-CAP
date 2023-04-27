import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from 'aws-amplify';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  skills: any = ['NILL'];
  userEmail: any = '';
  ngOnInit(): void {
    this.getUserDetails();
  }
  constructor(public api: ApiService, public form: MatDialog) {}

  async getUserDetails() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.userEmail = attributes['email'];
    this.api.getEmployeeDetails(this.userEmail).subscribe({
      next: (res) => {
        console.log(res);
        if (res[0].skillgap.length != 0) {
          this.skills = res[0].skillgap;
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onClick(skill: any) {
    const url = `/task?skill=${skill}`;
    window.open(url);
  }

  onClose() {
    this.form.closeAll();
  }
}
