import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { User } from "aws-sdk/clients/budgets";

@Component({
  selector: "app-admin-delete-request",
  templateUrl: "./admin-delete-request.component.html",
  styleUrls: ["./admin-delete-request.component.css"],
})
export class AdminDeleteRequestComponent {
  displayedColumns: string[] = [
    "user",
    "reason",
    "certification",
    "certificateId",
    "dateOfCertification",
    "dateOfExpiry",
    "validity",
    "action",
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
      this.user = {} as User;
      this.getRequests();
    } else {
      alert("Unauthenticated User!");
      this.route.navigate([""]);
    }
  }
  getRequests = async () => {
    this.api.getRequests(this.email).subscribe({
      next: (res) => {
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
    console.log(row);
    this.api.adminDelete(row).subscribe({
      next: (res) => {
        alert("Deleted!");
        window.location.reload();
        this.getRequests();
      },
      error: (err) => {
        alert("Error!");
        console.log(err);
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
