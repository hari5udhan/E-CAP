import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ApiService } from "src/app/services/api.service";
import { Auth } from "aws-amplify";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TrainingRequestComponent } from "../dialog/training-request/training-request.component";
import { SuggestionComponent } from "../dialog/suggestion/suggestion.component";

@Component({
  selector: "app-certificates",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class CertificatesComponent implements OnInit {
  searchFormControl = new FormControl("", Validators.required);
  isLoading: boolean = true;
  isContainer: boolean = false;
  isCertificate: boolean = false;
  isVerified: boolean = false;
  isCard: boolean = true;
  email: string = "";
  displayedColumns: string[] = ["certification", "status"];
  sl: any;
  sbu: any;
  role: any;
  pending!: MatTableDataSource<any>;
  expiredCertificate: any = [];
  records!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    private route: Router,
    private form: MatDialog
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem("userId");
    if (
      user == "harisudhanv24@gmail.com" ||
      user == "ksulaxman@gmail.com" ||
      user == "vasanthagokulsadhanandham@gmail.com"
    ) {
      alert("Unauthenticated User!");
      this.route.navigate([""]);
    } else {
      var localData = localStorage.getItem("id_token");
      if (localData) {
        setTimeout(() => {
          this.isLoading = false;
          this.isContainer = true;
        }, 2000);
        this.getAllCertifications();
      } else {
        alert("Unauthorized \nLogin to access!");
        this.route.navigate([""]);
      }
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
  });

  getAllCertifications = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    this.getUserDetails(this.email);
    this.getPendingRequests();
    this.getTrainingRequestsRecords();
  };
  getUserDetails = async (mail: any) => {
    this.api.getEmployeeDetails(mail).subscribe({
      next: (res) => {
        this.sl = res[0].sl;
        this.sbu = res[0].sbu;
        this.role = res[0].designation;
        if (this.sbu == "NULL" || this.sl == "NULL" || this.role == "NULL") {
          alert("Update Your profile!");
          this.route.navigate(["/profile"]);
        }
        // console.log(res)
      },
    });
  };
  getPendingRequests() {
    this.api.getPendingTrainingRequests().subscribe({
      next: (res) => {
        this.pending = new MatTableDataSource(res.Items);
        this.pending.paginator = this.paginator;
        this.pending.sort = this.sort;
      },
    });
  }

  getTrainingRequestsRecords = async () => {
    await this.api.getUserSpecificTrain(this.email).subscribe({
      next: (res) => {
        console.log(res);
        this.records = new MatTableDataSource(res);
        this.records.paginator = this.paginator;
        this.records.sort = this.sort;
        this.isLoading = false;
      },
    });
  };

  close() {
    this.isCertificate = false;
    this.isCard = true;
  }
  ontraining() {
    this.form.open(TrainingRequestComponent, {
      width: "55%",
    });
  }
  getCurrentUser = async () => {
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        this.trainingForm.controls["sl"].setValue(res.Items[0].employeeSl);
        this.trainingForm.controls["sbu"].setValue(res.Items[0].employeeSbu);
      },
    });
    this.trainingForm.controls["userName"].setValue(this.email);
  };
  openForm(data: any) {
    switch (data) {
      case "AWS-SYA": {
        this.trainingForm.controls["certificationProvider"].setValue(
          "Amazon Web Service(AWS)"
        );
        this.trainingForm.controls["certificationLevel"].setValue("Associate");
        this.trainingForm.controls["certificationName"].setValue(
          "SysOps Administrator"
        );
        break;
      }
      case "AWS-SAA": {
        this.trainingForm.controls["certificationProvider"].setValue(
          "Amazon Web Service(AWS)"
        );
        this.trainingForm.controls["certificationLevel"].setValue("Associate");
        this.trainingForm.controls["certificationName"].setValue(
          "Solutions Architect"
        );
        break;
      }
      case "GCP-PDE": {
        this.trainingForm.controls["certificationProvider"].setValue(
          "Google Cloud Platform(GCP)"
        );
        this.trainingForm.controls["certificationLevel"].setValue(
          "Professional"
        );
        this.trainingForm.controls["certificationName"].setValue(
          "Data Engineer"
        );
        break;
      }
      case "AzA": {
        this.trainingForm.controls["certificationProvider"].setValue(
          "Microsoft Azure"
        );
        this.trainingForm.controls["certificationLevel"].setValue("Associate");
        this.trainingForm.controls["certificationName"].setValue(
          "Administrator Associate"
        );
        break;
      }
      default: {
        alert("select an option");
        break;
      }
    }
    this.form.open(TrainingRequestComponent, {
      width: "55%",
      data: this.trainingForm.value,
    });
  }
}
