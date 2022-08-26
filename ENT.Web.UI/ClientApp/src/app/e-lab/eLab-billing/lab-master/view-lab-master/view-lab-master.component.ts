import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-lab-master',
    templateUrl: './view-lab-master.component.html',
    styleUrls: ['./view-lab-master.component.css']
  })
  export class ViewLabMasterComponent implements OnInit {
    AllowSubMaster: string="";
//#region Constructor
    constructor(public dialog: MatDialogRef<ViewLabMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
//#endregion Constructor

//#region ngOnInit
    ngOnInit() { 
      if(this.data.AllowSubMaster){
        this.AllowSubMaster="Yes";
      }else{
        this.AllowSubMaster="No";
      }
    }
//#endregion ngOnInit

//#region  Form  close
    close() {
      this.dialog.close();
    }
//#endregion  Form  close
}