import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-skill-assignform',
  templateUrl: './skill-assignform.component.html',
  styleUrls: ['./skill-assignform.component.css'],
})
export class SkillAssignformComponent implements OnInit {
  employeeform = new FormGroup({
    mail: new FormControl(''),
    fname: new FormControl(''),
    lname: new FormControl(''),
    sl: new FormControl(''),
    sbu: new FormControl(''),
    skill: new FormControl(''),
  });
  filteredOptions: Observable<string[]> | undefined;
  skills: any = [];
  myControl = new FormControl('');

  constructor(
    public api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.getSkills();
    if (this.data) {
      this.employeeform.controls['mail'].setValue(this.data.mail);
      this.employeeform.controls['fname'].setValue(this.data.fname);
      this.employeeform.controls['lname'].setValue(this.data.lname);
      this.employeeform.controls['sl'].setValue(this.data.sl);
      this.employeeform.controls['sbu'].setValue(this.data.sbu);
      this.employeeform.controls['skill'].setValue('cloud-basic');
    }
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
    this.employeeform.controls['skill'].setValue(skill);
  }
  getSkills() {
    this.api.getSkills().subscribe({
      next: (res) => {
        let a: any;
        a = res;
        this.skills = a.skills;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onApprove() {
    this.api.addEmployee(this.employeeform.value).subscribe({
      next: (res) => {
        alert(res);
        this.employeeform.reset();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
