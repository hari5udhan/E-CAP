import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css'],
})
export class TaskPageComponent implements OnInit {
  taskForm: FormGroup;
  timeLeft: number = 600;
  interval: any;
  skill: any;
  oldTask: any = [];
  questions: any = [];
  data: any = [];
  userMail: any;
  attempt: any = 0;
  constructor(
    private router: ActivatedRoute,
    public api: ApiService,
    public route: Router,
    public fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      skill: [''],
      mail: [''],
      task: [[]],
      oldTask: [[]],
    });
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else if (this.timeLeft == 0) {
        alert('Time Over');
        this.checkAnswers();
        window.close();
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
    this.router.queryParams.subscribe((params) => {
      this.skill = params['skill'];
    });
    this.getQuestions();
  }

  getDetails() {
    this.api.getEmployeeDetails(this.userMail).subscribe({
      next: (res) => {
        let tasks = [];
        for (let i of res[0].task) {
          tasks.push(JSON.parse(i));
        }
        for (let task of tasks) {
          // console.log(task.skill);
          if (this.skill == task.skill) {
            this.attempt = task.attempt + 1;
            this.oldTask = task;
            // console.log(this.oldTask);
          } else {
            console.log(this.attempt);
          }
        }
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getQuestions = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.userMail = attributes['email'];
    this.getDetails();
    this.taskForm.controls['mail'].setValue(this.userMail);
    this.taskForm.controls['skill'].setValue(this.skill);

    this.api.getQuestions(this.skill).subscribe({
      next: async (res) => {
        let a: any = [];
        a = res;
        this.questions = a.rows[0].taskdata;
        let min = 0;
        let max = 20;
        let numbers: number[] = [];
        for (let i = 0; i < 10; i++) {
          this.data.push(JSON.parse(this.questions[i]));
        }
        // while (this.data.length < 10) {
        //   const a = Math.floor(Math.random() * (max - min + 1)) + min;
        //   if (!numbers.includes(a)) {
        //     await this.data.push(JSON.parse(this.questions[a]));
        //     numbers.push(a);
        //   }
        // }
        // console.log(this.data);
      },
      error(err) {
        console.log(err);
      },
    });
  };

  formatTime(time: number) {
    let minutes: number = Math.floor(time / 60);
    let seconds: number = time - minutes * 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  selectedAnswers: string[] = [];

  checkAnswers() {
    let score: number = 0;
    let point = 10;
    for (let i = 0; i < this.data.length; i++) {
      if (this.selectedAnswers[i] == this.data[i].answer) {
        score = score + point;
      }
    }
    let passingScore = 70;
    if (passingScore <= score) {
      let task = {
        skill: this.skill,
        attempt: this.attempt,
        status: 'cleared',
        score: score,
      };
      this.taskForm.controls['task'].setValue(task);
      this.taskForm.controls['oldTask'].setValue(this.oldTask);
      // console.log(task);
      this.onClear();
    } else {
      let task = {
        skill: this.skill,
        attempt: this.attempt,
        status: 'not cleared',
        score: score,
      };
      this.taskForm.controls['task'].setValue(task);
      this.taskForm.controls['oldTask'].setValue(this.oldTask);
      console.log(this.oldTask);
      this.onNotClear();
      alert('Passing Score is 70.Your score is ' + score);
    }
  }

  onClear() {
    this.api.updateEmployeeTaskOnClear(this.taskForm.value).subscribe({
      next: (res) => {
        alert(res);
        window.close();
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onNotClear() {
    this.api.updateEmployeeTaskOnNotClear(this.taskForm.value).subscribe({
      next: (res) => {
        alert(res);
        window.close();
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onCancel() {
    window.close();
  }
}
