import { ApiService } from "../../../services/api.service";
import { CertificateRegisterationFormComponent } from "../certificate-registeration-form/certificate-registeration-form.component";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Auth } from "aws-amplify";
import { DeleteRequestComponent } from "../delete-request/delete-request.component";
@Component({
  selector: "app-view-certificate",
  templateUrl: "./view-certificate.component.html",
  styleUrls: ["./view-certificate.component.css"],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    "certification",
    "certificateId",
    "dateOfExpiry",
    "action",
  ];
  selectedRow: any;
  isExpired: boolean = false;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private route: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem("userId");
    if (
      user == "harisudhanv24@gmail.com" ||
      user == "ksulaxman@gmail.com" ||
      user == "vasanthagokulsadhanandham@gmail.com"
    ) {
      alert("Admin is not allowed in this route!");
      this.route.navigate(["/admin-home"]);
    } else {
      var localData = localStorage.getItem("id_token");

      if (localData) {
        this.getAllCertifications();
      } else {
        alert("Unauthorized \nLogin to access!");
        this.route.navigate(["/login"]);
      }
    }
  }
  getAllCertifications = async () => {
    var email;
    const { attributes } = await Auth.currentAuthenticatedUser();
    email = attributes["email"];

    this.api.getCertifications(email).subscribe({
      next: (res) => {
        // console.log(res)
        this.dataSource = new MatTableDataSource(res.Items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        for (var i = 0; i < res.Count; i++) {
          const expiryDate = new Date(res.Items[i].dateOfExpiry);
          // console.log(res.Items[0])
          const date = new Date();
          if (expiryDate.getFullYear() == date.getFullYear()) {
            // console.log('year')
            if (expiryDate.getMonth() == date.getMonth()) {
              // console.log('m')
              if (expiryDate.getDay() == date.getDay()) {
                this.api
                  .expiredCertification(
                    res.Items[i].certificateId,
                    res.Items[i].certificationName,
                    res.Items[i].certificationProvider
                  )
                  .subscribe({
                    next: (emailResponse) => {
                      // console.log(emailResponse)
                    },
                    error: (error) => {
                      console.log(error);
                    },
                  });
              }
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  onEdit(row: any) {
    this.dialog
      .open(CertificateRegisterationFormComponent, {
        width: "60%",
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val == "update") {
          this.getAllCertifications();
        }
      });
  }

  // onDelete(row : number){
  //   this.api.deleteCertification(row).subscribe({
  //     next:(res)=>{
  //     alert("Deleted!");
  //     this.getAllCertifications();
  //   },
  //     error:()=>{
  //       alert("Error!");
  //     }
  //   })
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRequest(row: any) {
    this.dialog.open(DeleteRequestComponent, {
      width: "30%",
      data: row,
    });
  }

  onClickCertificate(data: any) {
    this.selectedRow = data;
    var date = new Date();
    const expiryDate = new Date(this.selectedRow.dateOfExpiry);
    var validity = expiryDate.getFullYear() - date.getFullYear();
    console.log(validity);
    if (validity <= 0) {
      this.isExpired = true;
    }
  }

  closeCard() {
    this.selectedRow = null;
  }
}
