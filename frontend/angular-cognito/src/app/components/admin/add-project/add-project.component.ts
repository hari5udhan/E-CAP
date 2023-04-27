import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { User } from 'src/app/models/user';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit{
  projectForm: FormGroup;
  constructor( public api: ApiService , public fb: FormBuilder){
    this.projectForm= this.fb.group({
      name: ['', Validators.required],
      des: ['', Validators.required],
      skill: [[]],
      exp: ['', Validators.required],
      start: [ new Date(), Validators.required],
      end: [new Date(), Validators.required]
    })
  }

  
  courseForm= new FormControl('');
  myControl = new FormControl('');   coursesList: string[]=[]; selectedSkill: string | undefined;
  filteredOptions: Observable<string[]> | undefined;
  user: User | any; skills: any= []; a: any=[]; b: any=[];
  separatorKeysCodes: number[] = [ENTER, COMMA]; dateStart: any; dateEnd: any; dateEnd1: any;

  ngOnInit(): void {
    let year= new Date().getFullYear();
    let month= new Date().getMonth();
    let date= new Date().getDate();
    this.dateStart= new Date();
    this.dateEnd1= new Date(year, month+1,date+10)
    this.dateEnd= new Date(year+1,month,date)
    this.getSkills();
    }
    getSkills(){
      this.api.getSkills().subscribe({
        next:(res)=>{
          this.a= res;
          this.skills= this.a.skills;   
        },
        error:(err)=>{
          console.log(err);
        }
       });
       this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => this._filter(value || '')),
      );
    }

    private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.skills.filter((option: string) => option.toLowerCase().includes(filterValue));
    }
    
    onSelect(event: MatAutocompleteSelectedEvent){
      let skill: string= event.option.value;
      this.selectedSkill= skill;
      this.api.getCourses(skill).subscribe({
        next:(res)=>{
          this.b= res;     
          let len = this.b.course[0]
          let size= len.length;
           for(let i=0; i< size; i++){
            if (this.coursesList.indexOf(this.b.course[0][i]) === -1) {
              this.coursesList.push(this.b.course[0][i]);
            }
           }
        }, 
        error:(err)=>{
          console.log(err);
        }
      })
    
     }

  
add(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();

  // Add our course
  if (value) {
    if (this.coursesList.indexOf(value) === -1) {
      this.coursesList.push(value);
    }
  }

  // Clear the input value
  event.chipInput!.clear();

  this.courseForm.setValue(null);
}

remove(course: string): void {
  const index = this.coursesList.indexOf(course);

  if (index >= 0) {
    this.coursesList.splice(index, 1);
  }
}


onSubmit(){
  this.projectForm.controls['skill'].setValue(this.coursesList);
  this.api.addNewProject(this.projectForm.value).subscribe({
    next:(res)=>{
      alert(res);
      window.location.reload();
    },
    error(err) {
      console.log(err)
    },

  })
}
}
