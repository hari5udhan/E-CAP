import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { ApiService } from "src/app/services/api.service";
import { MatDialog } from "@angular/material/dialog";
import { AccountDeleteComponent } from "../../user/dialog/account-delete/account-delete.component";
import { AccountDeleteRequestComponent } from "../../user/dialog/account-delete-request/account-delete-request.component";
import { SelectionModel } from "@angular/cdk/collections";
import { windowTime } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { AssignProjectformComponent } from "../assign-projectform/assign-projectform.component";
import { SkillAssignformComponent } from "../skill-assignform/skill-assignform.component";

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"],
})
export class AdminUsersComponent implements OnInit {
  isNewUser: boolean = true;
  isEmployee: boolean = false;
  user: User | any;
  allComplete: boolean = false;
  color: any = "#00000";
  displayedColumns: string[] = [
    "select",
    "email",
    "name",
    "sbu",
    "sl",
    "action",
  ];
  dataSource!: MatTableDataSource<any>;
  users: number = 0;
  selectedRow: any;
  numRows: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  constructor(
    private api: ApiService,
    private route: Router,
    private form: MatDialog
  ) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.getUsers();
  }

  employeeForm = new FormGroup({
    mail: new FormControl(""),
    fname: new FormControl(""),
    lname: new FormControl(""),
    sl: new FormControl(""),
    sbu: new FormControl(""),
    skill: new FormControl(""),
  });

  getUsers() {
    this.api.getOtherUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.users = res.Count;
        this.dataSource = new MatTableDataSource(res.Items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
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
    this.route.navigate([""]);
  }

  onRowClick(data: any) {
    this.selectedRow = data;
    // console.log(this.selectedRow)
  }

  onClose() {
    this.selectedRow = null;
  }

  onReject = async (row: string) => {
    this.api.userDelete(row).subscribe({
      next: (res) => {
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  // onDelete=async(row : any)=>{
  //      await this.api.getAllCertifications(row).subscribe({
  //         next:(res)=>{
  //           const count = res.Count;
  //           const data=[row,res.Count];
  //           if(count > 0){
  //             this.form.open(AccountDeleteRequestComponent,{
  //               width: '55%',
  //               data: data,
  //             })
  //           }
  //           else if(count == 0){
  //             this.form.open(AccountDeleteComponent,{
  //               width: '55%',
  //               data: data,
  //             })
  //           }
  //           else{
  //             return;
  //           }
  //         }
  //       })
  //   }

  onApproveAll = async () => {
    for (let i of this.selection.selected) {
      this.employeeForm.controls["mail"].setValue(i.mail);
      this.employeeForm.controls["fname"].setValue(i.fname);
      this.employeeForm.controls["lname"].setValue(i.lname);
      this.employeeForm.controls["sl"].setValue(i.sl);
      this.employeeForm.controls["sbu"].setValue(i.sbu);
      this.employeeForm.controls["skill"].setValue("cloud-basic");
      this.api.addEmployee(this.employeeForm.value).subscribe({
        next: (res) => {
          this.employeeForm.reset();
          console.log(res);
        },
        error(err) {
          console.log(err);
        },
      });
    }
  };

  onRejectAll = async () => {
    for (let i of this.selection.selected) {
      this.api.userDelete(i.mail).subscribe({
        next: (res) => {
          console.log(res);
        },
        error(err) {
          console.log(err);
        },
      });
    }
  };

  onApprove = async (row: any) => {
    this.employeeForm.controls["mail"].setValue(row.mail);
    this.employeeForm.controls["fname"].setValue(row.fname);
    this.employeeForm.controls["lname"].setValue(row.lname);
    this.employeeForm.controls["sl"].setValue(row.sl);
    this.employeeForm.controls["sbu"].setValue(row.sbu);
    this.employeeForm.controls["skill"].setValue("cloud-basic");
    this.api.addEmployee(this.employeeForm.value).subscribe({
      next: (res) => {
        alert(res);
        this.employeeForm.reset();
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  };

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  onSelect(data: any) {
    this.form.open(SkillAssignformComponent, {
      width: "50%",
      data: data,
    });
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
}
