import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { User } from "src/app/models/user";

@Component({
  selector: "app-admin-view-certificates",
  templateUrl: "./admin-view-certificates.component.html",
  styleUrls: ["./admin-view-certificates.component.css"],
})
export class AdminViewCertificatesComponent {
  displayedColumns: string[] = [
    "userName",
    "certificationProvider",
    "certificationLevel",
    "certificationName",
    "certificateId",
    "dateOfCertification",
    "dateOfExpiry",
    "validity",
    "sbu",
    "sl",
  ];
  dataSource!: MatTableDataSource<any>;
  user: User | any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  email = [
    "harisudhanv24@gmail.com",
    "ksulaxman@gmail.com",
    "vasanthagokulsadhanandham@gmail.com",
  ];
  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private route: Router
  ) {}

  ngOnInit(): void {
    let localData: any = localStorage.getItem("userId");
    if (this.email.includes(localData)) {
      this.getAllCertifications();
      this.user = {} as User;
    } else {
      alert("Unauthenticated User!");

      this.route.navigate([""]);
    }
  }
  getAllCertifications = async () => {
    this.api.getAllCertifications(this.email).subscribe({
      next: (res) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res.Items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  onDelete(row: number) {
    this.api.deleteCertification(row).subscribe({
      next: (res) => {
        alert("Deleted!");
        this.getAllCertifications();
      },
      error: () => {
        alert("Error!");
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClick() {
    this.route.navigate(["/admin-home"]);
  }
  signOut() {
    this.api.logOut(this.user);
    this.route.navigate(["/login"]);
  }
}
