import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { User } from "aws-sdk/clients/budgets";
import { Auth } from "aws-amplify";
import { SbuFormComponent } from "../dialog/sbu-form/sbu-form.component";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ModalPageComponent } from "../dialog/modal-page/modal-page.component";
import { ProjectCompletionComponent } from "../dialog/project-completion/project-completion.component";
import { SkillsEditComponent } from "../dialog/skills-edit/skills-edit.component";
import { TaskDialogComponent } from "../task-section/task-dialog/task-dialog.component";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
  user: User | any;
  name: any;
  userMail: any;
  sl: any;
  sbu: any;
  role: any;
  approvedSkill: any;
  approvedSkillCount: any = 0;
  userCourse: any = "NILL";
  userCourseCount: any = 0;
  unapprovedSkill: any = "NILL";
  unapprovedSkillCount: any = 0;
  uncompletedProjects: any = "NILL";
  uncompletedProjectsCount: any = 0;
  completedProjects: any = "NILL";
  completedProjectsCount: any = 0;
  email: any;
  uncompletedCourses: string[] = [];
  uncompletedCoursesCount: any = 0;
  profilePercentage: any;
  certificatesCount: any = 0;
  skillgap: any;
  addedCertificates: any;
  uncompletedForm = new FormControl("");
  ngOnInit(): void {
    this.user = {} as User;
    const user = localStorage.getItem("userId");
    if (
      user == "harisudhanv24@gmail.com" ||
      user == "ksulaxman@gmail.com" ||
      user == "vasanthagokulsadhanandham@gmail.com"
    ) {
      this.route.navigate(["/admin-home"]);
    } else {
      var localData = localStorage.getItem("id_token");
      if (localData) {
        this.getUserDetails();
      } else {
        alert("Unauthorized \nLogin to access!");
        this.route.navigate(["/login"]);
      }
    }
  }
  uncompleted = new FormControl("");
  constructor(
    public form: MatDialog,
    public api: ApiService,
    public route: Router,
    public fb: FormBuilder
  ) {}

  async getUserDetails() {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    await this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        console.log(res);
        let singleCount = 100 / 7;
        let count = 42.8571;
        if (
          res[0].sl != "NULL" &&
          res[0].sbu != "NULL" &&
          res[0].designation != "NULL"
        ) {
          count = count + 3 * singleCount;
        }
        this.sl = res[0].sl;
        this.sbu = res[0].sbu;
        this.userMail = res[0].mail;
        this.name = res[0].fname + res[0].lname;
        if (res[0].courses.length != 0) {
          this.userCourse = res[0].courses;
          this.userCourseCount = res[0].courses.length;
        }
        this.role = res[0].designation;

        if (res[0].unapprovedskill.length != 0) {
          this.unapprovedSkill = res[0].unapprovedskill;
          this.unapprovedSkillCount = res[0].unapprovedskill.length;
        }
        if (res[0].approvedskill.length != 0) {
          this.approvedSkill = res[0].approvedskill;
          count = count + singleCount;
          this.approvedSkillCount = res[0].approvedskill.length;
        }
        if (res[0].skillgap.length != 0) {
          this.uncompletedCourses = res[0].skillgap;
          this.uncompletedCoursesCount = res[0].skillgap.length;
          this.skillgap = this.uncompletedCourses;
        } else {
          for (let i of this.approvedSkill) {
            this.api.getCourses(i).subscribe({
              next: (res) => {
                let storedCourses: any;
                storedCourses = res;
                for (let course of storedCourses.course[0]) {
                  if (!this.userCourse.includes(course)) {
                    if (this.uncompletedCourses.indexOf(course) === -1) {
                      this.uncompletedCourses.push(course);
                      this.uncompletedCoursesCount =
                        this.uncompletedCoursesCount + 1;
                    }
                  }
                }
                this.skillgap = this.uncompletedCourses;
              },
            });
          }
        }
        if (res[0].completedprojects.length != 0) {
          this.completedProjects = res[0].completedprojects;
          this.completedProjectsCount = res[0].completedprojects.length;
        }
        if (res[0].uncompletedprojects.length != 0) {
          this.uncompletedProjects = res[0].uncompletedprojects;
          this.uncompletedProjectsCount = res[0].uncompletedprojects.length;
        }
        if (res[0].certificates) {
          this.addedCertificates = res[0].certificates;
          this.certificatesCount = res[0].certificates.length;
        }
        // console.log(res[0].certificates[0]);
        // this.uncompletedCoursesCount = this.uncompletedCourses.length;
        this.profilePercentage = Math.round(count);
        if (this.profilePercentage > 100) {
          this.profilePercentage = 100;
        }

        this.api.getCertifications(this.email).subscribe({
          next: (res) => {
            this.certificatesCount = res.Count;
          },
        });
      },
    });
  }

  onEditProfileDetails() {
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.form.open(SbuFormComponent, {
          width: "50%",
          data: res[0],
        });
      },
    });
  }

  onProject() {
    this.form.open(ProjectCompletionComponent, {
      width: "50%",
    });
  }

  onSkillEdit(data: any) {
    this.form.open(SkillsEditComponent, {
      width: "50%",
      data: data,
    });
  }

  onTakeAssesments() {
    this.form.open(TaskDialogComponent, {
      width: "50%",
    });
  }

  onclick(cluster: any) {
    let modalpage = new FormGroup({
      title: new FormControl(""),
      list: new FormControl(""),
    });

    switch (cluster) {
      case "cluster":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.approvedSkill);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      case "skill":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.userCourse);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      case "skillGap":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.skillgap);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      case "ongProjects":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.uncompletedProjects);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      case "projects":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.completedProjects);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      case "certificates":
        modalpage.controls["title"].setValue(cluster);
        modalpage.controls["list"].setValue(this.addedCertificates);
        this.form.open(ModalPageComponent, {
          width: "50%",
          data: modalpage.value,
        });
        break;

      default:
        console.log(" ");
    }
  }
}
