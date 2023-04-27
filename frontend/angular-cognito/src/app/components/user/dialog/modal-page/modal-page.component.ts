import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.css'],
})
export class ModalPageComponent implements OnInit {
  status: any = '';
  list: any = 'NONE';
  modalData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public form: MatDialog
  ) {}
  ngOnInit(): void {
    if (this.data) {
      this.modalData = this.data;
      let tittle = this.data.title;
      switch (tittle) {
        case 'cluster':
          this.status = 'Achieved Skill';
          this.list = this.data.list;
          break;

        case 'projects':
          this.status = 'Completed Projects';
          this.list = this.data.list;
          break;

        case 'certificates':
          this.status = 'Achieved Certificates';
          this.list = this.data.list;
          break;

        case 'ongProjects':
          this.status = 'Ongoing Projects';
          this.list = this.data.list;
          break;

        case 'skillGap':
          this.status = 'Skill Gap';
          this.list = this.data.list;
          break;

        case 'skill':
          this.status = 'Completed Skill';
          this.list = this.data.list;
          break;

        default:
          console.log(' ');
      }
    }
  }

  closeCard() {
    this.modalData = null;
    window.location.reload();
  }

  onClose() {
    this.form.closeAll();
  }
}
