import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.css']
})
export class AccountDeleteComponent implements OnInit{
 certificatesCount!: any; userMail: any; userList: any[]=[];  CognitoUserList:any[]= []; CognitoUsername: any;
constructor(private api : ApiService, private route: Router, private dialogref: MatDialogRef<AccountDeleteComponent>, @Inject(MAT_DIALOG_DATA) public editData : any){}

ngOnInit(): void {
  if(this.editData){
    this.CognitoUsername= this.editData[0];
    this.certificatesCount= this.editData[1];
    this.userMail= this.editData[2];
    this.getEmployee();
  }}

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

onConfirm(){
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
  
  

}
