import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CertificateRegisterationFormComponent } from '../certificate-registeration-form/certificate-registeration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  user: User | any;
  certificatesCount!: number; email: any;


  constructor(private form: MatDialog, private api: ApiService, private route: Router) { }
  ngOnInit(): void {
    this.onDelete();
  }
  onClick(){
    this.route.navigate(['/home']);
  }


  signOut(){
  this.api.logOut(this.user);
  this.route.navigate(['']);
  }
  openForm(){
    this.form.open(CertificateRegisterationFormComponent,{
      width:'55%'
    })
  }

  getCount= async ()=>{
    const { attributes } = await Auth.currentAuthenticatedUser();
    // console.log(attributes);
    this.email= attributes['email'];
    this.api.getCertifications(this.email).subscribe({
      next:(res)=>{
        this.certificatesCount= res.Count;
        // console.log(res)
      }
    })
  }

  onDelete(){
    this.getCount();
  }

}
