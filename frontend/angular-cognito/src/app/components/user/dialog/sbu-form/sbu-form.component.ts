import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-sbu-form',
  templateUrl: './sbu-form.component.html',
  styleUrls: ['./sbu-form.component.css'],
})
export class SbuFormComponent implements OnInit {
  isCertified: boolean = false;
  Certificates: any;
  selected: string = '';
  isOther: boolean = false;
  isLevel: boolean = true;
  servicesForm: FormGroup;
  newCertificates: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    @Inject(MAT_DIALOG_DATA) public profileData: any,
    public api: ApiService,
    private fb: FormBuilder
  ) {
    this.servicesForm = this.fb.group({
      sbu: [''],
      sl: [''],
      fname: [''],
      lname: [''],
      skill: [''],
      mail: [''],
      role: [''],
      certifications: [[]],
      dummy: [[]],
    });
  }

  ngOnInit(): void {
    if (this.profileData) {
      this.servicesForm.controls['fname'].setValue(this.profileData.fname);
      this.servicesForm.controls['lname'].setValue(this.profileData.lname);
      this.servicesForm.controls['sbu'].setValue(this.profileData.sbu);
      this.servicesForm.controls['sl'].setValue(this.profileData.sl);
      this.servicesForm.controls['skill'].setValue(this.profileData.skill);
      this.servicesForm.controls['mail'].setValue(this.profileData.mail);
      this.servicesForm.controls['role'].setValue(this.profileData.designation);
    }
  }

  onUpdate() {
    this.api.updateEmployeeServices(this.servicesForm.value).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
      },
    });
  }

  addNewCertificates(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      if (this.newCertificates.indexOf(value) === -1) {
        this.newCertificates.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
    this.servicesForm.controls['dummy'].setValue(null);
  }

  removeNew(course: string): void {
    const index = this.newCertificates.indexOf(course);

    if (index >= 0) {
      this.newCertificates.splice(index, 1);
    }
  }
  onOther(data: any) {
    switch (data) {
      case 'Other': {
        this.isLevel = false;
        this.isOther = true;
        break;
      }
      case 'aws': {
        this.isLevel = true;
        this.isOther = false;
        this.selected = 'aws';
        break;
      }
      case 'gcp': {
        this.isLevel = true;
        this.isOther = false;
        this.selected = 'gcp';
        break;
      }
      case 'azure': {
        this.isLevel = true;
        this.isOther = false;
        this.selected = 'azure';
        break;
      }
      default: {
        break;
      }
    }
  }

  onSelect(level: any) {
    if (this.selected == 'aws') {
      if (level == 'f') {
        this.Certificates = ['Cloud Practitioner'];
      } else if (level == 'a') {
        this.Certificates = [
          'Developer',
          'SysOps Administrator',
          'Solutions Architect',
        ];
      } else if (level == 'p') {
        this.Certificates = ['DevOps Engineer', 'Solutions Architect'];
      }
    } else if (this.selected == 'gcp') {
      if (level == 'f') {
        this.Certificates = ['Cloud Digital Leader'];
      } else if (level == 'a') {
        this.Certificates = ['Cloud Engineer'];
      } else if (level == 'p') {
        this.Certificates = [
          'Cloud Architect',
          'Cloud Database Engineer',
          'Cloud Developer',
          'Data Engineer',
        ];
      }
    } else {
      if (level == 'f') {
        this.Certificates = ['Azure Fundamentals'];
      } else if (level == 'a') {
        this.Certificates = [
          'Administrator Associate',
          'Developer Associate',
          'Solutions Architect Associate',
          'DevOps Engineer Expert',
        ];
      } else if (level == 'p') {
        this.Certificates = [
          'Data Engineer',
          'AI Engineer',
          'Security Engineer',
          'Administrator',
          'Architect Technologies',
          'Architect Design',
        ];
      }
    }
  }

  showCertification() {
    this.isCertified = true;
  }
}
