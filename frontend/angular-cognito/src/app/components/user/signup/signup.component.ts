import { ApiService } from "../../../services/api.service";
import { Router, RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { FormControl, FormGroup } from "@angular/forms";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  user: User | undefined;
  isConfirm: boolean = true;
  mail: string = "";
  isSBUoptions: boolean = true;
  isSLoptions: boolean = true;
  isInput: boolean = false;
  minDate: any;
  maxDate: any;
  constructor(private route: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
  }
  employeeForm = new FormGroup({
    mail: new FormControl(""),
    sl: new FormControl(""),
    sbu: new FormControl(""),
    fname: new FormControl(""),
    lname: new FormControl(""),
    skill: new FormControl(""),
  });

  public addUser() {
    if (this.user && this.user.email && this.user.password) {
      this.mail = this.user.email;
      const value = "NULL";
      this.employeeForm.controls["mail"].setValue(this.user.email);
      this.employeeForm.controls["fname"].setValue(this.user.fname);
      this.employeeForm.controls["lname"].setValue(this.user.lname);
      this.employeeForm.controls["sl"].setValue(value);
      this.employeeForm.controls["sbu"].setValue(value);
      this.employeeForm.controls["skill"].setValue(value);

      this.api
        .signUp(this.user)
        .then(() => {
          this.isConfirm = true;
        })
        .catch((error: any) => {
          alert(error);
        });
    } else {
      alert("Missing fields!");
    }
  }

  public confirmUser = async () => {
    if (this.user) {
      await this.api
        .confirmLogin(this.user)
        .then(async () => {
          console.log(this.employeeForm.value);
          await this.api.addUser(this.employeeForm.value).subscribe({
            next: (res) => {
              alert("Check your mail for verification of Identity");
              this.route.navigate(["/login"]);
            },
            error: (err) => {
              console.log(err);
              alert(err.message);
              this.route.navigate(["/login"]);
            },
          });
        })
        .catch((error: any) => {
          alert(error);
          console.log(error);
        });
    } else {
      alert("Try again!");
    }
  };

  sbuOther() {
    this.isSBUoptions = false;
    this.isInput = true;
  }
  slOther() {
    this.isSLoptions = false;
    this.isInput = true;
  }
}
