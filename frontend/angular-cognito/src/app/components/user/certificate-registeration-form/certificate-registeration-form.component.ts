import { ApiService } from "../../../services/api.service";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
// import {MatLegacyDialog as MAT_DIALOG_DATA}  from '@angular/material/legacy-dialog';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Auth } from "aws-amplify";
import { HomeComponent } from "../view-certificates/view-certificate.component";
import { SuggestionComponent } from "../dialog/suggestion/suggestion.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-certificate-registeration-form",
  templateUrl: "./certificate-registeration-form.component.html",
  styleUrls: ["./certificate-registeration-form.component.css"],
})
export class CertificateRegisterationFormComponent implements OnInit {
  email: any;
  actionbtn: string = "Submit";
  isLevel: boolean = true;
  isOther: boolean = false;
  Certificates: any;
  selected: string = "";
  isList: boolean = false;
  isInput: boolean = false;
  isSBUoptions: boolean = true;
  isSLoptions: boolean = true;
  isForm: boolean = true;
  users: any;
  minDate: any;
  maxDate: any;
  year: any;
  month: any;
  isService: boolean = false;
  constructor(
    public popup: MatSnackBar,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public home: HomeComponent,
    private dialogref: MatDialogRef<CertificateRegisterationFormComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 2, 0, 1);
    this.maxDate = new Date(currentYear + 3, 11, 31);
    this.getCurrentUser();
    this.getUserDetails();
    console.log(this.editData);
    if (this.editData) {
      this.actionbtn = "Update";
      this.isService = true;
      this.certificateForm.controls["certificationProvider"].setValue(
        this.editData.certificationProvider
      );
      this.certificateForm.controls["certificationLevel"].setValue(
        this.editData.certificationLevel
      );
      this.certificateForm.controls["certificationName"].setValue(
        this.editData.certificationName
      );
      this.certificateForm.controls["certificateId"].setValue(
        this.editData.certificateId
      );
      this.certificateForm.controls["dateOfCertification"].setValue(
        this.editData.dateOfCertification
      );
      this.certificateForm.controls["dateOfExpiry"].setValue(
        this.editData.dateOfExpiry
      );
      this.certificateForm.controls["userName"].setValue(
        this.editData.userName
      );
      this.certificateForm.controls["validity"].setValue(
        this.editData.validity
      );
      this.certificateForm.controls["sbu"].setValue(this.editData.sbu);
      this.certificateForm.controls["sl"].setValue(this.editData.sl);
      this.certificateForm.controls["certificationProvider"].disable();
      this.certificateForm.controls["certificationLevel"].disable();
      this.certificateForm.controls["certificationName"].disable();
      this.certificateForm.controls["certificateId"].disable();
    }
  }

  certificateForm = new FormGroup({
    certificationProvider: new FormControl("", Validators.required),
    certificationLevel: new FormControl("", Validators.required),
    certificationName: new FormControl("", Validators.required),
    certificateId: new FormControl("", Validators.required),
    dateOfCertification: new FormControl(new Date()),
    dateOfExpiry: new FormControl(new Date()),
    userName: new FormControl(""),
    validity: new FormControl(""),
    sbu: new FormControl("", Validators.required),
    sl: new FormControl("", Validators.required),
  });

  getCurrentUser = async () => {
    var sl = "Null",
      sbu = "Null";
    const { attributes } = await Auth.currentAuthenticatedUser();
    this.email = attributes["email"];
    this.api.getEmployeeDetails(this.email).subscribe({
      next: (res) => {
        console.log(res);
        this.certificateForm.controls["sl"].setValue(res[0].sl);
        this.certificateForm.controls["sbu"].setValue(res[0].sbu);
      },
    });
    this.certificateForm.controls["userName"].setValue(this.email);
  };

  getUserDetails() {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        for (var i = 0; i < res.Count; i++) {
          this.users.push(res.Items[i].employeeMail);
        }
        //  console.log(this.users)
      },
    });
  }

  setValidity(data: any) {
    console.log(data.dateOfCertification);
    var sDate: any, eDate: any;
    const date1 = new Date(data.dateOfCertification);
    const date2 = new Date(data.dateOfExpiry);
    sDate = date1.getFullYear();
    eDate = date2.getFullYear();
    const validity = eDate - sDate;
    return validity;
  }

  setDateFormat(data: any) {
    const date = new Date(data);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  onSubmitCertificate() {
    console.log(this.certificateForm.value);
    if (!this.editData) {
      if (this.certificateForm.valid) {
        let validity: any = this.setValidity(this.certificateForm.value);
        this.certificateForm.controls["validity"].setValue(validity);
        this.api.addCertification(this.certificateForm.value).subscribe({
          next: (res) => {
            this.dialog.open(SuggestionComponent, {
              width: "40%",
              data: this.certificateForm.value,
            });
            let pops = this.popup.open("Certification Added", "Ok", {
              horizontalPosition: "center",
              verticalPosition: "top",
            });
            this.dialogref.close("save");
            pops.afterDismissed().subscribe({
              next: (res) => {
                window.location.reload();
                this.certificateForm.reset();
              },
            });
          },
          error: (error) => {
            alert("Error while adding certification!");
            console.log(error);
          },
        });
      } else {
        alert("Fill all missing Fields!");
      }
    } else {
      this.updateCertificate();
    }
  }

  updateCertificate() {
    let validity: any = this.setValidity(this.certificateForm.value);
    this.certificateForm.controls["validity"].setValue(validity);
    this.api
      .updateCertifications(
        this.certificateForm.value,
        this.editData.certificateId
      )
      .subscribe({
        next: (res) => {
          alert("Updated!");
          console.log(this.editData.certificateId);
          this.certificateForm.reset();
          this.dialogref.close("updated!");
          window.location.reload();
        },
        error: (err) => {
          console.log(err);
          alert("Error!");
        },
      });
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
          "Solutions Architect Associate",
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

  sbuOther() {
    this.isSBUoptions = false;
    this.isInput = true;
  }
  slOther() {
    this.isSLoptions = false;
    this.isInput = true;
  }
}
