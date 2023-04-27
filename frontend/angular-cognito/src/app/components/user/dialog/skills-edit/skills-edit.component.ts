import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService } from 'src/app/services/api.service';
import { Auth } from 'aws-amplify';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.css'],
})
export class SkillsEditComponent implements OnInit {
  coursesForm: FormGroup;
  email: any;
  selectedSkill: string | undefined;
  definedSkill: any = [];
  userSkills: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  newCoursesList: string[] = [];
  newSkill: any;
  skills: any = [];
  a: any = [];
  b: any = [];
  myControl = new FormControl('');
  userCourse: any = [];
  uncompleted: any = [];
  certificatesCount: any;
  addedCertificates: any = [];
  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.coursesForm = this.fb.group({
      mail: [''],
      sl: [''],
      sbu: [''],
      fname: [''],
      lname: [''],
      skill: [''],
      courses: [''],
      newcourses: [[]],
      skillgap: [[]],
      certificates: [[]],
    });
  }
  filteredOptions: Observable<string[]> | undefined;

  ngOnInit(): void {
    if (this.data) {
      if (this.data.length != 0) {
        for (let i of this.data) {
          this.uncompleted.push(i);
        }
      }
    }
    this.getCurrentUser();
    this.getSkills();
  }

  getSkills() {
    this.api.getSkills().subscribe({
      next: (res) => {
        this.a = res;
        this.skills = this.a.skills;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.skills.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onSelect(event: MatAutocompleteSelectedEvent) {
    let skill: string = event.option.value;
    this.selectedSkill = skill;
    this.api.getCourses(skill).subscribe({
      next: (res) => {
        this.b = res;
        for (let i of this.b.course[0]) {
          this.newCoursesList.push(i);
          this.uncompleted.push(i);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCurrentUser = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes['email'];
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.coursesForm.controls['sl'].setValue(res[0].sl);
        this.coursesForm.controls['sbu'].setValue(res[0].sbu);
        this.coursesForm.controls['fname'].setValue(res[0].fname);
        this.coursesForm.controls['lname'].setValue(res[0].lname);
        this.coursesForm.controls['mail'].setValue(res[0].mail);
        this.userCourse = res[0].courses;
        if (res[0].courses.length != 0) {
          this.newCoursesList = res[0].courses;
        }
        this.userSkills = res[0].approvedskill;
        this.api.getCertifications(this.email).subscribe({
          next: (res) => {
            this.certificatesCount = res.Count;
            if (res.Count != 0) {
              for (var i = 0; i < res.Count; i++) {
                var certificate =
                  res.Items[i].certificationProvider +
                  ' ' +
                  res.Items[i].certificationName;
                this.addedCertificates.push(certificate);
              }
            }
          },
        });
      },
    });
  };
  addNewCourse(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (this.newCoursesList.indexOf(value) === -1) {
        this.newCoursesList.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    this.coursesForm.controls['courses'].setValue(null);
  }

  removeNew(course: string): void {
    const index = this.newCoursesList.indexOf(course);

    if (index >= 0) {
      this.newCoursesList.splice(index, 1);
    }
  }

  async onSubmit() {
    for (let course of this.newCoursesList) {
      if (
        !this.uncompleted.includes(course) &&
        !this.userCourse.includes(course)
      ) {
        this.uncompleted.push(course);
      }
    }
    if (this.newCoursesList) {
      this.coursesForm.controls['newcourses'].setValue(this.newCoursesList);
      this.coursesForm.controls['skillgap'].setValue(this.uncompleted);
      this.coursesForm.controls['skill'].setValue(this.selectedSkill);
      this.coursesForm.controls['certificates'].setValue(
        this.addedCertificates
      );
      this.api.updateEmployeeCourses(this.coursesForm.value).subscribe({
        next: (res) => {
          alert(res);
          this.coursesForm.reset();
          this.newCoursesList = [];
          window.location.reload();
        },
        error: (err) => {
          if (err == 'The conditional request failed') {
            alert('An skill approval request already pending!');
          } else {
            console.log(err);
          }
        },
      });
    }
  }
}
