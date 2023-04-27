import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { User } from "aws-sdk/clients/budgets";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-skill-approval",
  templateUrl: "./skill-approval.component.html",
  styleUrls: ["./skill-approval.component.css"],
})
export class SkillApprovalComponent {
  displayedColumns: string[] = ["mail", "name", "sbu", "sl", "courses"];
  selectedRow: any;
  userMail: any;
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
  skillAssignForm = new FormGroup({
    mail: new FormControl(""),
    skill: new FormControl(""),
    assignedSkill: new FormControl(""),
  });
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

  getRequests() {
    this.api.getSkillApprovalRequests().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.Items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onReject(row: number) {
    this.api.rejectSkillApprovalRequest(row).subscribe({
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

  setValue(data: any) {
    this.skillAssignForm.controls["mail"].setValue(this.userMail);
    let skill = data.skill;
    // console.log(skill)
    this.skillAssignForm.controls["assignedSkill"].setValue(skill);
    // console.log(data.skill)
  }
  onApprove() {
    // console.log(this.skillAssignForm.value);
    this.api.approveSkillApprovalRequest(this.skillAssignForm.value).subscribe({
      next: (res) => {
        alert(res);
        window.location.reload();
      },
      error: (err) => {
        alert("Error!");
        console.log(err);
      },
    });
  }

  onSelect(data: any) {
    this.selectedRow = data;
    this.userMail = this.selectedRow.mail;
    // console.log(this.selectedRow)
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
