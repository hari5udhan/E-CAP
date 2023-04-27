import { Component, Inject, ViewChild } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { saveAs } from "file-saver";
import { ApiService } from "src/app/services/api.service";
import { User } from "aws-sdk/clients/budgets";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Router } from "@angular/router";
import * as Papa from "papaparse";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-view-training-request",
  templateUrl: "./view-training-request.component.html",
  styleUrls: ["./view-training-request.component.css"],
})
export class ViewTrainingRequestComponent {
  displayedColumns: string[] = [
    "select",
    "datefrom",
    "dateto",
    "username",
    "certificationprovider",
    "certificationname",
    "sbu",
    "action",
  ];
  jsonData: any[] = [];
  file: any;
  color: any = "#0000";
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  user: User | any;
  trainingJSONdata: any;
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
    private route: Router,
    private live: LiveAnnouncer
  ) {}

  dateRangeForm = new FormGroup({
    rangeFrom: new FormControl(""),
    rangeTo: new FormControl(""),
  });

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

  ngOnInit(): void {
    let localData: any = localStorage.getItem("userId");
    if (this.email.includes(localData)) {
      this.user = {} as User;
      this.getNewReq();
    } else {
      alert("Unauthenticated User!");

      this.route.navigate([""]);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  getNewReq() {
    this.api.getPendingTrainingRequests().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.Items);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  onRequestDataInRange() {
    this.api.downloadDataInRange(this.dateRangeForm.value).subscribe({
      next: (data) => {
        saveAs(data, "tableName.csv");
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.live.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.live.announce("Sorting cleared");
    }
  }

  onClick() {
    this.route.navigate(["/admin-home"]);
  }
  signOut() {
    this.api.logOut(this.user);
    this.route.navigate(["/login"]);
  }

  download() {
    this.api.reqestDownload().subscribe({
      next: (data) => {
        saveAs(data, "tableName.csv");
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sampleDownload() {
    const data = [
      {
        username: "xxxx@gmail.com",
        certificationprovider: "xxxx",
        certificationname: "xxxx",
        certiifcationlevel: "xxxx",
        sbu: "xxx",
        sl: "xxx",
        datefrom: "yyyy-mm-dd",
        dateto: "yyyy-mm-dd",
        status: "aaaa",
      },
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data.csv");
  }

  onUpload() {
    // for(const file of files){
    Papa.parse(this.file, {
      header: true,
      complete: (res) => {
        this.api.upload(res.data).subscribe({
          next: (response) => {
            console.log(response);
            alert("Uploaded!");
          },
          error: (err) => {
            console.log(err);
            alert("Error!");
          },
        });
      },
    });

    // console.log(this.jsonData)
    // }
  }
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onApprove(row: any) {
    row.status = "Approved";
    this.api.approveTraingReq(row).subscribe({
      next: (res) => {
        console.log(res);
        window.location.reload();
      },
    });
  }

  onApproveAll() {
    const count = this.selection.selected.length;
    let i = 0;
    do {
      this.onApprove(this.selection.selected[i]);
      i = i + 1;
    } while (i < count);
    if (i == count) {
      window.location.reload();
    }
  }

  onReject(row: any) {
    row.status = "Rejected";
    this.api.approveTraingReq(row).subscribe({
      next: (res) => {
        console.log(res);
        window.location.reload();
      },
    });
  }

  onRejectAll() {
    const count = this.selection.selected.length;
    let i = 0;
    do {
      this.onReject(this.selection.selected[i]);
      i = i + 1;
    } while (i < count);
    if (i == count) {
      window.location.reload();
    }
  }
}
