import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Auth } from 'aws-amplify';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-project-completion',
  templateUrl: './project-completion.component.html',
  styleUrls: ['./project-completion.component.css'],
})
export class ProjectCompletionComponent implements OnInit {
  projects: any = [];
  email: any;
  projectForm = new FormGroup({
    projectname: new FormControl(' '),
    mail: new FormControl(' '),
    status: new FormControl(''),
  });
  constructor(public api: ApiService) {}
  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes['email'];
    await this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.projects = res[0].uncompletedprojects;
      },
    });
  }

  onRequests() {
    this.projectForm.controls['mail'].setValue(this.email);
    this.api.requestCompletion(this.projectForm.value).subscribe({
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
