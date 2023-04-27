import { ContentObserver } from "@angular/cdk/observers";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Auth } from "aws-amplify";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-training-request",
  templateUrl: "./training-request.component.html",
  styleUrls: ["./training-request.component.css"],
})
export class TrainingRequestComponent implements OnInit {
  Certificates: any;
  selected: string = "";
  isLevel: boolean = true;
  isOther: boolean = false;
  isList: boolean = false;
  startDate = new Date();
  minDate: any;
  maxDate: any;
  users: any = [];
  email: any;
  userChecked: boolean = false;
  count: any;
  sl: any;
  sbu: any;
  constructor(
    private api: ApiService,
    private dialogref: MatDialogRef<TrainingRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public formData: any
  ) {}
  ngOnInit(): void {
    this.getCurrentUser();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDate);
    this.maxDate = new Date(currentYear, currentMonth, currentDate + 30);
    console.log(this.formData);
    if (this.formData) {
      this.trainingForm.controls["certificationProvider"].setValue(
        this.formData.certificationProvider
      );
      this.trainingForm.controls["certificationLevel"].setValue(
        this.formData.certificationLevel
      );
      this.trainingForm.controls["certificationName"].setValue(
        this.formData.certificationName
      );
    }
  }
  trainingForm = new FormGroup({
    certificationProvider: new FormControl("", Validators.required),
    certificationLevel: new FormControl("", Validators.required),
    certificationName: new FormControl("", Validators.required),
    sbu: new FormControl(""),
    sl: new FormControl(""),
    dateFrom: new FormControl(new Date()),
    dateTo: new FormControl(new Date()),
    userName: new FormControl(""),
    status: new FormControl(""),
  });

  // getUsers(){
  //   this.api.getUser().subscribe({
  //     next:(res)=>{
  //       this.count= res.Users.length;
  //       for(var i=0; i<this.count; i++){
  //         this.users.push(res.Users[i].Attributes[4].Value)
  //       }
  //       // console.log(this.users)
  //     },
  //     error:(err)=>{
  //       console.log(err);
  //     }})
  // }

  getUserDetails() {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        for (var i = 0; i < res.Count; i++) {
          this.users.push(res[i].mail);
        }
      },
    });
  }

  getCurrentUser = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        console.log(res);
        this.trainingForm.controls["sl"].setValue(res[0].sl);
        this.trainingForm.controls["sbu"].setValue(res[0].sbu);
      },
    });
    this.trainingForm.controls["userName"].setValue(this.email);
    this.trainingForm.controls["status"].setValue("Requested");

    this.getUserDetails();
  };

  onSelect(level: any) {
    if (this.selected == "aws") {
      if (level == "f") {
        this.Certificates = ["Cloud Practitioner"];
      } else if (level == "a") {
        this.Certificates = [
          "Developer",
          "SysOps Administrator",
          "Solutions Architect",
        ];
      } else if (level == "p") {
        this.Certificates = ["DevOps Engineer", "Solutions Architect"];
      }
    } else if (this.selected == "gcp") {
      if (level == "f") {
        this.Certificates = ["Cloud Digital Leader"];
      } else if (level == "a") {
        this.Certificates = ["Cloud Engineer"];
      } else if (level == "p") {
        this.Certificates = [
          "Cloud Architect",
          "Cloud Database Engineer",
          "Cloud Developer",
          "Data Engineer",
        ];
      }
    } else {
      if (level == "f") {
        this.Certificates = ["Azure Fundamentals"];
      } else if (level == "a") {
        this.Certificates = [
          "Administrator Associate",
          "Developer Associate",
          "Solutions Architect",
          "DevOps Engineer Expert",
        ];
      } else if (level == "p") {
        this.Certificates = [
          "Data Engineer",
          "AI Engineer",
          "Security Engineer",
          "Administrator",
          "Architect Technologies",
          "Architect Design",
        ];
      }
    }
  }
  onOther(data: any) {
    switch (data) {
      case "Other": {
        this.isLevel = false;
        this.isOther = true;
        this.isList = true;
        break;
      }
      case "aws": {
        this.isLevel = true;
        this.isOther = false;
        this.selected = "aws";
        this.isList = false;
        break;
      }
      case "gcp": {
        this.isLevel = true;
        this.isOther = false;
        this.selected = "gcp";
        this.isList = false;
        break;
      }
      case "azure": {
        this.isLevel = true;
        this.isOther = false;
        this.selected = "azure";
        this.isList = false;
        break;
      }
      default: {
        break;
      }
    }
  }
  // setDate(data : any){
  //   var datefrom, dateto;
  //   // datefrom= data.dateFrom.toLocaleDateString("en-GB",{
  //   //   day:"2-digit",
  //   //   month:"2-digit",
  //   //   year: "numeric"
  //   // });
  //   // // console.log(datefrom)
  //   // dateto= data.dateTo.toLocaleDateString("en-GB",{
  //   //   day:"2-digit",
  //   //   month:"2-digit",
  //   //   year: "numeric"
  //   // });

  //   // this.trainingForm.controls['dateFrom'].setValue(datefrom);
  //   // this.trainingForm.controls['dateTo'].setValue(dateto);
  // }

  onSubmit() {
    if (this.trainingForm.valid) {
      // this.setDate(this.trainingForm.value);
      // console.log(this.trainingForm.value)
      this.api.requestTraining(this.trainingForm.value).subscribe({
        next: (res) => {
          alert("Requested");
          this.dialogref.close();
        },
        error: (err) => {
          alert("Error while requesting!");
          console.log(err);
        },
      });
    } else {
      alert("Fill all missing Fields!");
    }
  }
}
