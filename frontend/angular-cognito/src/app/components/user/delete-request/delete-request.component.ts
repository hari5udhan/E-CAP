import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-delete-request',
  templateUrl: './delete-request.component.html',
  styleUrls: ['./delete-request.component.css']
})
export class DeleteRequestComponent implements OnInit{  
  reason: any;
constructor(@Inject(MAT_DIALOG_DATA) public deleteData: any, private api: ApiService){}
certificateForm = new FormGroup({
  certificationProvider : new FormControl('',Validators.required),
    certificationLevel: new FormControl('',Validators.required),
    certificationName: new FormControl('',Validators.required),
    certificateId: new FormControl('',Validators.required),
    dateOfCertification: new FormControl('',Validators.required),
    dateOfExpiry: new FormControl('',Validators.required),
    userName: new FormControl(''),
    validity: new FormControl(''),
    reasonForDeletion: new FormControl('')
    // request: new FormControl('')
})


ngOnInit(): void {
  if(this.deleteData){
      this.certificateForm.controls['certificationProvider'].setValue(this.deleteData.certificationProvider);
      this.certificateForm.controls['certificationLevel'].setValue(this.deleteData.certificationLevel);
      this.certificateForm.controls['certificationName'].setValue(this.deleteData.certificationName);
      this.certificateForm.controls['certificateId'].setValue(this.deleteData.certificateId);
      this.certificateForm.controls['dateOfCertification'].setValue(this.deleteData.dateOfCertification);
      this.certificateForm.controls['dateOfExpiry'].setValue(this.deleteData.dateOfExpiry);  
      this.certificateForm.controls['userName'].setValue(this.deleteData.userName);
      this.certificateForm.controls['validity'].setValue(this.deleteData.validity);
      // this.certificateForm.controls['request'].setValue('True');
  }
}

onConfirm(data : any){
    if(this.certificateForm.valid){
      this.certificateForm.controls['reasonForDeletion'].setValue(data);
      this.api.requestDeletion(this.certificateForm.value).subscribe({
        next:(res)=> {
          alert("Requested!");
          window.location.reload();
          // this.certificateForm.reset();   
        },
        error:(error)=>{
          alert("Try Again");
          console.log(error);
        }
      })}
}}
