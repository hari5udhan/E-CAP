import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-skill-form',
  templateUrl: './skill-form.component.html',
  styleUrls: ['./skill-form.component.css'],
})
export class SkillFormComponent implements OnInit {
  skillsForm: FormGroup;
  newCoursesList: string[] = [];
  definedSkill: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  email: any;

  ngOnInit(): void {
    this.getCurrentUser();
  }
  constructor(private fb: FormBuilder, public api: ApiService) {
    this.skillsForm = this.fb.group({
      mail: [''],
      sl: [''],
      sbu: [''],
      fname: [''],
      lname: [''],
      skills: [[]],
      courses: [[]],
    });
  }
  addNewCourse(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (this.newCoursesList.indexOf(value) === -1) {
        this.newCoursesList.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    this.skillsForm.controls['courses'].setValue(null);
  }

  removeNew(course: string): void {
    const index = this.newCoursesList.indexOf(course);

    if (index >= 0) {
      this.newCoursesList.splice(index, 1);
    }
  }

  getCurrentUser = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes['email'];
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.skillsForm.controls['sl'].setValue(res[0].sl);
        this.skillsForm.controls['sbu'].setValue(res[0].sbu);
        this.skillsForm.controls['fname'].setValue(res[0].fname);
        this.skillsForm.controls['lname'].setValue(res[0].lname);
        this.skillsForm.controls['mail'].setValue(res[0].mail);
      },
      error(err) {
        console.log(err);
      },
    });
  };

  onSubmit() {
    this.skillsForm.controls['courses'].setValue(this.newCoursesList);
    this.api.getCourseTable().subscribe({
      next: (res) => {
        let storedCourses: any;
        storedCourses = res;
        let maxCount = 0;
        for (let item of storedCourses) {
          let count = 100 / item.course.length;
          let percentage = 0;
          for (let course of item.course) {
            if (this.newCoursesList.includes(course)) {
              percentage = percentage + count;
            }
          }

          let skill = { skill: item.skills, percentage: percentage };
          this.definedSkill.push(skill);
        }
        // console.log(this.definedSkill)
        let skill = this.findLargestThree(this.definedSkill);
        // console.log(skill);
        this.skillsForm.controls['skills'].setValue(skill);

        this.api.requestSkillApproval(this.skillsForm.value).subscribe({
          next: (response) => {
            alert(response);
            this.skillsForm.reset();
            window.location.reload();
          },
          error(error) {
            console.log(error);
          },
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }
  private findLargestThree(
    arr: { skill: string; percentage: number }[]
  ): { skill: string; percentage: number }[] {
    const sortedArr = arr.sort((a, b) => b.percentage - a.percentage);
    const resultArr = [];
    const skillSet = new Set();

    for (let i = 0; i < sortedArr.length && resultArr.length < 3; i++) {
      const { skill, percentage } = sortedArr[i];
      if (!skillSet.has(skill)) {
        skillSet.add(skill);
        resultArr.push({ skill, percentage });
      }
    }

    return resultArr;
  }
}
