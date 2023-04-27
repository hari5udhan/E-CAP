import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  displayedColumns: string[] = ['username', 'status', 'creation'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  trainReq: boolean = true;
  deleteReq: boolean = true;
  email = 'harisudhanv24@gmail.com';
  graph: boolean = false;
  certificateCount: number = 0;
  deleteRequests: number = 0;
  users: number = 0;
  trainingRequests: number = 0;
  trainingRecord: number = 0;
  newUser: number = 0;
  newUserReq: boolean = true;
  awsCount: any;
  azureCount!: number;
  gcpCount!: number;
  otherCount: number = 0;
  data: any[] = [];
  datasets: any = [];
  labels: any = [];
  constructor(private api: ApiService, private route: Router) {}

  ngOnInit(): void {
    var localData = localStorage.getItem('userId');
    if (localData) {
      this.getUsers();
      this.getAllCertificates();
      this.getCount();
      this.getTrainingRequests();
      this.getPendingTraingRequest();
    } else {
      alert('Unauthenticated User!');
      this.route.navigate(['']);
    }
  }

  getPendingTraingRequest() {
    this.api.getPendingTrainingRequests().subscribe({
      next: (res) => {
        this.trainingRequests = res.Count;
      },
    });
  }

  getUsers() {
    this.api.getUser().subscribe({
      next: (res) => {
        this.users = Object.keys(res.Users).length - 1;
        this.dataSource = new MatTableDataSource(res.Users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getEmployeeTable() {
    this.api.getAllEmployee().subscribe({
      next: (res) => {
        this.newUser = res.Count;
      },
    });
  }

  getTrainingRequests() {
    this.api.getTrainingRequests().subscribe({
      next: (res) => {
        this.trainingRecord = res.rowCount;
        if (res.Count > 0) {
          this.trainReq = false;
        }
      },
    });
  }

  getAllCertificates() {
    this.api.getAllCertifications(this.email).subscribe({
      next: (res) => {
        this.certificateCount = res.Count;
      },
    });
    this.api.getRequests(this.email).subscribe({
      next: (res) => {
        this.deleteRequests = res.Count;
        if (res.Count > 0) {
          this.deleteReq = false;
        }
      },
    });
    this.api.getOtherUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.newUser = res.Count;
        if (res.Count > 0) {
          this.newUserReq = false;
        }
      },
    });
  }

  viewUser() {
    this.route.navigate(['/view-user']);
  }

  getCount() {
    this.api.getAWS().subscribe({
      next: (awsRes) => {
        this.awsCount = awsRes.Count;
        //  console.log(this.awsCount)
        this.api.getAzure().subscribe({
          next: (azuRes) => {
            this.azureCount = azuRes.Count;
            this.api.getGcp().subscribe({
              next: (gcpRes) => {
                this.gcpCount = gcpRes.Count;
                this.api.getOther().subscribe({
                  next: (otheRes) => {
                    this.otherCount = otheRes.Count;
                    this.datasets = [
                      {
                        label: 'Certification Count',
                        data: [
                          this.awsCount,
                          this.gcpCount,
                          this.azureCount,
                          this.otherCount,
                        ],
                        backgroundColor: [
                          '#ffad33',
                          '#ff6666',
                          '#99c2ff',
                          ' #ccffb3',
                        ],
                      },
                    ];
                  },
                });
              },
            });
          },
        });
      },
    });

    this.labels = ['AWS', 'GCP', 'AZURE', 'Other'];
  }

  onClick() {
    this.route.navigate(['/view-user']);
  }
}
