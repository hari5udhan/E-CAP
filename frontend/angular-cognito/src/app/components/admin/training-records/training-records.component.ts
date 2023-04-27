import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-training-records',
  templateUrl: './training-records.component.html',
  styleUrls: ['./training-records.component.css']
})
export class TrainingRecordsComponent implements OnInit{
  displayedColumns: string[] = ['username', 'certification',
  'datefrom','dateto','status']; 
  selectedRow: any; isExpired: boolean= false; isOptions: boolean = true; isInput: boolean = false;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor( private api: ApiService){}
  ngOnInit(): void {
  this.getAlltrainingRecords();
  }
  getAlltrainingRecords(){
    this.api.getTrainingRequests().subscribe({
      next:(res)=>{
        // console.log(res.rows)
        this.dataSource= new MatTableDataSource(res.rows);
        this.dataSource.paginator= this.paginator;
        this.dataSource.sort= this.sort;
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
