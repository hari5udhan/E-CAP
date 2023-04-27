import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  user: User | any;
  constructor(private api: ApiService, private route: Router) {}

  onClick() {
    this.route.navigate(['/admin-home']);
  }

  signOut() {
    this.api.logOut(this.user);
    this.route.navigate(['']);
  }
}
