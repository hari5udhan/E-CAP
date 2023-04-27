import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-account-delete-request',
  templateUrl: './account-delete-request.component.html',
  styleUrls: ['./account-delete-request.component.css']
})
export class AccountDeleteRequestComponent implements OnInit{
certificatesCount!: any; email: any; result: any; userMail: any;  CognitoUserList:any[]= []; CognitoUsername: any;
constructor(private api: ApiService ,@Inject(MAT_DIALOG_DATA) public editData : any,private route: Router, 
private dialogref: MatDialogRef<AccountDeleteRequestComponent>){}
userList: any[]=[];

ngOnInit(): void {
  if(this.editData){
    this.CognitoUsername= this.editData[0];
    this.certificatesCount= this.editData[1];
    this.userMail= this.editData[2];
    this.getEmployee();
  }
  else{
    alert('Error!')
  }
}
getEmployee(){
  this.api.getAllEmployee().subscribe({
    next:(res)=>{
      for(var i=0;i< res.Count;i++){
        // console.log(res.Items[i].employeeMail)
        this.userList.push(res.Items[i].employeeMail)
      }
    }
  })
}

onConfirm= async()=>{ 
  this.api.getCertifications(this.userMail).subscribe({
    next:(res)=>{
      for(var i=0;i< res.Count; i++){
      let id =res.Items[i].certificateId;
        this.api.deleteCertification(id).subscribe({
          next:async (res)=>{
            console.log(res);
            if(this.userList.includes(this.userMail)){
              this.api.deleteEmployee(this.userMail).subscribe({
                next: (res) => {
                  console.log(res);
                  window.location.reload();
                }
              })
            }
            else{
              this.api.deleteCognitoUser(this.CognitoUsername).subscribe({
                next: (res) => {
                  console.log(res);
                  window.location.reload();
                }
              })
            }
          }
        })
      }
    }
  });
}



}
