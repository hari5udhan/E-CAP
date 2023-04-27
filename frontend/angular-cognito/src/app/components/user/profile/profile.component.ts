import { Component } from '@angular/core';
import { User } from 'aws-sdk/clients/budgets';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Auth } from 'aws-amplify';
import { AccountDeleteRequestComponent } from '../dialog/account-delete-request/account-delete-request.component';
import { AccountDeleteComponent } from '../dialog/account-delete/account-delete.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SbuFormComponent } from '../dialog/sbu-form/sbu-form.component';
import { FocusTrap } from '@angular/cdk/a11y';
import { SkillsEditComponent } from '../dialog/skills-edit/skills-edit.component';
import { ContentObserver } from '@angular/cdk/observers';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user: User | any;
  email: any;
  fname: any;
  lname: any;
  skill: any;
  role: any;
  addedCertificates: any = [];
  userCourse: any = [];
  unapprovedSkill: any;
  uncompletedCourses: any = ['NILL'];
  certificatesCount: number = 0;
  editButton: string = 'Edit Details';
  deleteButton: string = 'Delete Account';
  completedProjects: any = ['NILL'];
  uncompletedProjects: any = ['NILL'];
  isInput: boolean = false;
  isDetails: boolean = true;
  sl: any;
  sbu: any;
  userMail: any;
  isOtherInput: boolean = false;
  CognitoUserList: any[] = [];
  CognitoUsername: any;
  constructor(
    private form: MatDialog,
    private api: ApiService,
    private route: Router
  ) {}
  employeeForm = new FormGroup({
    mail: new FormControl(''),
    sl: new FormControl(''),
    sbu: new FormControl(''),
    fname: new FormControl(''),
    lname: new FormControl(''),
    role: new FormControl(''),
    uncompletedcourse: new FormControl(''),
  });

  ngOnInit(): void {
    this.user = {} as User;
    const user = localStorage.getItem('userId');
    if (user == 'harisudhanv24@gmail.com') {
      this.route.navigate(['/admin-home']);
    } else {
      var localData = localStorage.getItem('id_token');
      if (localData) {
        this.getCurrentUser();
        this.mapSkills();
      } else {
        alert('Unauthorized \nLogin to access!');
        this.route.navigate(['/login']);
      }
    }
  }

  async getUserDetails() {
    await this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        // console.log(res[0].uncompletedprojects)
        this.sl = res[0].sl;
        this.sbu = res[0].sbu;
        this.email = res[0].mail;
        this.fname = res[0].fname;
        this.lname = res[0].lname;
        this.skill = res[0].approvedskill;
        this.userCourse = res[0].courses;
        this.role = res[0].designation;
        this.unapprovedSkill = res[0].unapprovedskill;
        // if(res[0].uncompletedcourses.length != 0){
        //   this.uncompletedCourses= res[0].uncompletedcourses;
        // }
        if (res[0].uncompletedprojects.length != 0) {
          this.uncompletedProjects = res[0].uncompletedprojects;
        }
        if (res[0].completedprojects.length != 0) {
          this.completedProjects = res[0].completedprojects;
        }
        this.getuncompleted();
      },
    });
  }

  getCurrentUser = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes['email'];
    this.userMail = attributes['email'];
    this.api.getUser().subscribe({
      next: (res) => {
        this.CognitoUserList = res.Users;
        for (var i = 0; i < res.Users.length; i++) {
          if (this.CognitoUserList[i].Attributes[2].Value == this.userMail) {
            this.CognitoUsername = this.CognitoUserList[i].Username;
          }
        }
      },
    });

    this.api.getCertifications(this.email).subscribe({
      next: (res) => {
        this.certificatesCount = res.Count;
        if (res.Count == 0) {
          this.addedCertificates.push('No certificates Added!');
          this.getUserDetails();
        } else {
          for (var i = 0; i < res.Count; i++) {
            var certificate =
              res.Items[i].certificationProvider +
              ' ' +
              res.Items[i].certificationName;
            this.addedCertificates.push(certificate);
            this.getUserDetails();
          }
        }
      },
    });
  };

  getuncompleted() {
    let uncompleted: any = [];
    for (let i of this.skill) {
      this.api.getCourses(i).subscribe({
        next: (res) => {
          // console.log(res)
          let storedCourses: any;
          storedCourses = res;
          for (let course of storedCourses.course[0]) {
            if (!this.userCourse.includes(course)) {
              if (uncompleted.indexOf(course) === -1) {
                uncompleted.push(course);
              }
            }
          }
        },
      });
    }
    this.uncompletedCourses = uncompleted;
    // this.api.updateUncompletedCourses(this.employeeForm.value, this.email)
    //   .subscribe({
    //     next: (res) => {
    //       // alert(res);
    //     },
    //     error: (err) => {
    //       console.log(err);
    //     },
    //   });
  }

  // openForm(){
  //   if(this.editButton=="Edit Details"){
  //   this.isInput= true;
  //   this.isDetails= false;
  //   this.editButton= "Submit";
  //   this.deleteButton= "Cancel";
  //   }
  //   else if(this.editButton=="Submit"){
  //     // console.log(this.employeeForm.controls['employeeFname'].value)
  //     this.user.fname= this.employeeForm.controls['fname'].value;
  //    this.user.lname = this.employeeForm.controls['lname'].value ;
  //      this.user.sbu= this.employeeForm.controls['sbu'].value;
  //     this.user.sl= this.employeeForm.controls['sl'].value ;
  //     if(this.user && this.user.fname){
  //       this.api.updateUser(this.user).then(()=>{
  //          this.api.updateEmployee(this.employeeForm.value, this.email).subscribe({
  //           next:(res)=>{
  //             window.location.reload();
  //           }
  //          })
  //       }).catch((error:any)=>{
  //         alert(error);
  //         console.log(error)
  //       })
  //     }
  //   }
  //   else{
  //     return;
  //   }

  // }

  onDelete() {
    if (this.deleteButton == 'Delete Account') {
      this.api.getCertifications(this.email).subscribe({
        next: (res) => {
          var data = [];
          data.push(this.CognitoUsername);
          data.push(res.Count);
          data.push(this.userMail);
          if (res.Items == 0) {
            this.form.open(AccountDeleteComponent, {
              width: '25%',
              data: data,
            });
          } else {
            this.form.open(AccountDeleteRequestComponent, {
              width: '40%',
              data: data,
            });
          }
        },
      });
    } else {
      this.isInput = false;
      this.isDetails = true;
      this.editButton = 'Edit Details';
      this.deleteButton = 'Delete Account';
    }
  }

  sbuOther() {
    this.isOtherInput = true;
  }

  slOther() {
    this.isOtherInput = true;
  }

  onEditProfileDetails() {
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.form.open(SbuFormComponent, {
          width: '50%',
          data: res[0],
        });
      },
    });
  }

  onSkillEdit() {
    this.form
      .open(SkillsEditComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe({
        next: (res) => {
          this.getuncompleted();
        },
      });
  }

  mapSkills() {
    this.api.getCourseTable().subscribe({
      next: (res) => {
        let storedCourses: any;
        storedCourses = res;
        // this.userCourse= ['course1','course2','course7','course6'];
        let maxCount = 0;
        let definedSkill = ' ';
        for (let item of storedCourses) {
          let count = 0;
          for (let course of item.course) {
            if (this.userCourse.includes(course)) {
              count++;
            }
            if (count > maxCount) {
              maxCount = count;
              definedSkill = item.skills;
            }
          }
        }
      },
    });
  }
}
