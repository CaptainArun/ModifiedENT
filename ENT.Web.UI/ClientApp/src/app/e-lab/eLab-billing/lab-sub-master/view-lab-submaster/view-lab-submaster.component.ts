import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-lab-submaster',
    templateUrl: './view-lab-submaster.component.html',
    styleUrls: ['./view-lab-submaster.component.css']
  })

export class ViewLabSubMasterComponent implements OnInit {
//#region View
    constructor(@Inject(MAT_DIALOG_DATA) public data: any ,  public dialog: MatDialogRef<ViewLabSubMasterComponent>){}

    ngOnInit() {}

    close() {
      this.dialog.close();
    }
//#endregion View
}