import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-billing-submaster',
    templateUrl: './view-billing-submaster.component.html',
    styleUrls: ['./view-billing-submaster.component.css']
  })

export class ViewBillingSubMasterComponent implements OnInit {

   //#region "constructor"
  constructor(public dialog: MatDialogRef<ViewBillingSubMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  //#endregion

  //#region "ngOnInit"
    ngOnInit() {
  }
   //#endregion

   //#region "dialogClose"
    dialogClose(): void {
      this.dialog.close();
  }
     //#endregion

  }
