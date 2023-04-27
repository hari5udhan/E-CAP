import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent {
  user: User | any;
 constructor(private api: ApiService, private route: Router){}
 
  onClick(){
    this.route.navigate(['/admin-home']);
  }

  signOut(){
  this.api.logOut(this.user);
  this.route.navigate(['']);
  }

 

}
