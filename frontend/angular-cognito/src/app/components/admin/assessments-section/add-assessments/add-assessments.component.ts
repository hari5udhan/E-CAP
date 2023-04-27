import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-add-assessments',
  templateUrl: './add-assessments.component.html',
  styleUrls: ['./add-assessments.component.css'],
})
export class AddAssessmentsComponent implements OnInit {
  assessmentsForm: FormGroup;
  file: any;
  questions: FormControl;
  constructor(public api: ApiService, public fb: FormBuilder) {
    this.assessmentsForm = this.fb.group({
      skill: [''],
      taskdata: [[]],
    });
    this.questions = new FormControl('');
  }
  ngOnInit(): void {}

  onSubmit() {
    let data = JSON.parse(this.questions.value);
    this.assessmentsForm.controls['taskdata'].setValue(data);
    // console.log(this.assessmentsForm.value);
    this.api.addNewTask(this.assessmentsForm.value).subscribe({
      next: (res) => {
        alert(res);
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
