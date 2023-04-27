import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, Observable, startWith } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  courses: string[] = [];
  selectedSkill: string | undefined;
  user: User | any;
  skills: any = [];
  a: any = [];
  b: any = [];
  courseForm = new FormControl('');
  myControl = new FormControl('');

  filteredOptions: Observable<string[]> | undefined;
  constructor(
    private api: ApiService,
    private route: Router,
    private http: HttpClient
  ) {}
  @ViewChild('select') select!: MatSelect;

  ngOnInit(): void {
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

  onSelect(event: MatAutocompleteSelectedEvent) {
    let skill: string = event.option.value;
    this.selectedSkill = skill;
    this.api.getCourses(skill).subscribe({
      next: (res) => {
        this.b = res;
        let len = this.b.course[0];
        let size = len.length;
        for (let i = 0; i < size; i++) {
          this.courses.push(this.b.course[0][i]);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.skills.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our course
    if (value) {
      this.courses.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.courseForm.setValue(null);
  }

  remove(course: string): void {
    const index = this.courses.indexOf(course);

    if (index >= 0) {
      this.courses.splice(index, 1);
    }
  }

  onUpdate() {
    this.api.updateCourses(this.courses, this.selectedSkill).subscribe({
      next: (res) => {
        alert(res);
        console.log(res);
        // window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDelete() {
    this.api.deleteSkills(this.selectedSkill).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
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
}
