import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { User } from 'src/app/models/user';
import { AccountDeleteRequestComponent } from '../../user/dialog/account-delete-request/account-delete-request.component';
import { AccountDeleteComponent } from '../../user/dialog/account-delete/account-delete.component';
import {SelectionModel} from '@angular/cdk/collections';
@Component({
  selector: 'app-cognito-user',
  templateUrl: './cognito-user.component.html',
  styleUrls: ['./cognito-user.component.css']
})
export class CognitoUserComponent implements OnInit{
  user: User | any;
  displayedColumns: string[] = ['email','name','status','creation', 'action'];
  dataSource!: MatTableDataSource<any>; selectedRow: any; users: any =[];
  @ViewChild(MatSort) sort!: MatSort;  CognitoUserList: any[]=[]; CognitoUsername: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator; data: any[]=[];
  selection = new SelectionModel<any>(true, []);
  constructor(private api: ApiService, private route: Router,private form: MatDialog){}


  ngOnInit(): void{
    const user= localStorage.getItem('userId')

    if(user){
      this.user= {} as User;
      this.getCognitoUsers();
    }
    else{
      alert('Unauthorized \nLogin to access!');
      this.route.navigate(['/login']);
    }
  }

  getCognitoUsers(){
    this.api.getUser().subscribe({
      next:(res)=>{
        this.dataSource= new MatTableDataSource(res.Users);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
        this.CognitoUserList= res.Users;
        // console.log(this.CognitoUserList.length)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  onClick(){
    this.route.navigate(['/admin-home']);
}

signOut(){
  this.api.logOut(this.user);
  this.route.navigate(['/login']);
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));   
  }

  async onDelete(row : any){
    for(var i=0; i< this.CognitoUserList.length ; i++){
      if(this.CognitoUserList[i].Attributes[2].Value == row){
         this.CognitoUsername= this.CognitoUserList[i].Username;
      }
    }
    this.api.getCertifications(row).subscribe({
      next:(res)=>{
        this.data.push(this.CognitoUsername);
        this.data.push(res.Count);
        this.data.push(row);
       if(res.Items == 0){
        this.form.open(AccountDeleteComponent,{
          width:'25%',
          data: this.data
        })
       
       }
       else{
        this.form.open(AccountDeleteRequestComponent,{
          width: '40%',
          data: this.data
        })
       }
      }
    })

  }
}
