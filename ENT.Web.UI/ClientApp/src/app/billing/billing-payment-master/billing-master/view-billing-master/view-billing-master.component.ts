import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-Billing-master',
    templateUrl: './view-Billing-master.component.html',
    styleUrls: ['./view-Billing-master.component.css']
  })
export class ViewBillingMasterComponent implements OnInit {

   //#region "constructor"
  constructor(public dialog: MatDialogRef<ViewBillingMasterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
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
