import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ApiService } from '../../../services/api.service';
import { CertificateRegisterationFormComponent } from '../certificate-registeration-form/certificate-registeration-form.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {User} from 'src/app/models/user';
import { Auth } from 'aws-amplify';
import { AccountDeleteRequestComponent } from '../dialog/account-delete-request/account-delete-request.component';
import { AccountDeleteComponent } from '../dialog/account-delete/account-delete.component';
import { TrainingRequestComponent } from '../dialog/training-request/training-request.component';

@Component({
  selector: 'app-sideNavbar',
  templateUrl: './sideNavbar.component.html',
  styleUrls: ['./sideNavbar.component.css']
})
export class SideNavbarComponent implements OnInit {
user: User | any;
email: any;
fname: any;
lname: any;
certificatesCount!: number;

  constructor(private form: MatDialog, private api: ApiService, private route: Router) { }
  
  ngOnInit(): void {
    this.user= {} as User;
    this.getCurrentUser();
  }

  getCurrentUser= async()=>{
    const { attributes } = await Auth.currentAuthenticatedUser();
    // console.log(attributes);
    this.email= attributes['email'];
    this.fname= attributes['given_name'];
    this.lname= attributes['family_name'];
  }

  openForm(){
    this.form.open(CertificateRegisterationFormComponent,{
      width:'60%'
    })
  }

  ontraining(){
    this.form.open(TrainingRequestComponent,{
      width: '55%'
    })
  }

  signOut(){
    this.api.logOut(this.user);
    this.route.navigate(['']);
    }


  onDelete(){
    this.api.getCertifications(this.email).subscribe({
      next:(res)=>{
       if(res.Items != null){
        this.form.open(AccountDeleteRequestComponent,{
          width: '55%',
          data: res.Items.length
        })
       }
       else{
        this.form.open(AccountDeleteComponent,{
          width:'55%'
        })
       }
      }
    });
  }
}