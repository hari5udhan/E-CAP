import { Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: User | undefined;
  isForgotPassword: boolean = false;
  newPassword: string = "";

  constructor(private api: ApiService, private route: Router) {}

  ngOnInit(): void {
    this.user = {} as User;
  }

  navigateToSignUp() {
    this.route.navigate(["/signup"]);
  }

  login() {
    if (this.user && this.user.email == "harisudhanv24@gmail.com") {
      // this.route.navigate(['/admin-home'])
      this.api.logIn(this.user).then(() => {
        this.route.navigate(["/admin-home"]);
      });
    } else if (this.user && this.user.email == "ksulaxman@gmail.com") {
      // this.route.navigate(['/admin-home'])
      this.api.logIn(this.user).then(() => {
        this.route.navigate(["/admin-home"]);
      });
    } else if (
      this.user &&
      this.user.email == "vasanthagokulsadhanandham@gmail.com"
    ) {
      // this.route.navigate(['/admin-home'])
      this.api.logIn(this.user).then(() => {
        this.route.navigate(["/admin-home"]);
      });
    } else if (
      this.user &&
      this.user.email == "VasanthagokulSadhanandham@gmail.com"
    ) {
      // this.route.navigate(['/admin-home'])
      this.api.logIn(this.user).then(() => {
        this.route.navigate(["/admin-home"]);
      });
    } else {
      if (this.user && this.user.email && this.user.password != null) {
        this.api
          .logIn(this.user)
          .then(() => {
            this.route.navigate(["/home"]);
          })
          .catch((error: any) => {
            alert(error);
            console.log(error);
          });
      } else {
        alert("Enter valid details!");
      }
    }
  }

  forgotPassword() {
    if (this.user && this.user.email) {
      this.api
        .forgotPassword(this.user)
        .then(() => {
          this.isForgotPassword = true;
        })
        .catch((error: any) => {
          alert(error);
        });
    } else {
      alert("Enter valid details!");
    }
  }

  newPasswordGenerate() {
    if (this.user && this.user.code && this.newPassword.trim().length != 0) {
      this.api
        .forgotPasswordSubmit(this.user, this.newPassword.trim())
        .then(() => {
          alert("Password changed!");
          this.isForgotPassword = false;
        })
        .catch((error: any) => {
          alert(error);
        });
    } else {
      alert("Enter valid details!");
    }
  }
}
