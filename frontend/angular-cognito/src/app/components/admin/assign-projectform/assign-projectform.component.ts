import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-assign-projectform',
  templateUrl: './assign-projectform.component.html',
  styleUrls: ['./assign-projectform.component.css'],
})
export class AssignProjectformComponent implements OnInit {
  projectName: any;
  des: any;
  Reqskill: any = [];
  start: any;
  end: any;
  suggestedUser: any = [];
  selectedRow: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public projectData: any,
    public api: ApiService
  ) {}

  userAssignForm = new FormGroup({
    user: new FormControl(''),
    projectname: new FormControl(''),
  });
  ngOnInit(): void {
    if (this.projectData) {
      this.projectName = this.projectData.projectname;
      this.des = this.projectData.des;
      this.Reqskill = this.projectData.skill;
      this.start = this.projectData.datefrom;
      this.end = this.projectData.dateto;
    }
    this.getSuggestion();
  }

  getSuggestion() {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        let users: any;
        users = res;
        let count = this.Reqskill.length;
        // console.log(count)
        for (let item of users) {
          let itemCount = 0;
          for (let course of item.courses) {
            if (this.Reqskill.includes(course)) {
              let singleCount = 100 / count;
              itemCount = itemCount + singleCount;
            }
          }
          let qualify = 100 / 1.665;
          itemCount = Math.round(itemCount);
          if (itemCount >= qualify) {
            let user = {
              mail: item.mail,
              name: item.fname + ' ' + item.lname,
              sl: item.sl,
              sbu: item.sbu,
              percentage: itemCount,
              role: item.designation,
            };
            this.suggestedUser.push(user);
          }
        }
        // console.log(this.suggestedUser)
      },
    });
  }

  onChange(data: any) {
    this.selectedRow = data;
  }

  onSubmit() {
    this.userAssignForm.controls['user'].setValue(this.selectedRow.mail);
    this.userAssignForm.controls['projectname'].setValue(this.projectName);
    this.api.assignProject(this.userAssignForm.value).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
