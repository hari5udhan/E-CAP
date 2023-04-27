import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  
  newCourseForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  newCoursesList: string[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.newCourseForm = this.fb.group({
      skill: ['', Validators.required],
      courses: [''],
      coursesArray: [[]]
    });
  }

  ngOnInit(): void {
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
    this.newCourseForm.controls['courses'].setValue(null);
  }

  removeNew(course: string): void {
    const index = this.newCoursesList.indexOf(course);

    if (index >= 0) {
      this.newCoursesList.splice(index, 1);
    }
  }

  onSubmit(): void {
    this.newCourseForm.controls['coursesArray'].setValue(this.newCoursesList);
    this.api.addNewSkills(this.newCourseForm.value).subscribe({
      next:(res)=>{
        alert(res);
      },
      error:(err)=>[
        console.log(err)
      ]
    })
    this.newCourseForm.reset();
    this.newCoursesList = [];
  }

}
