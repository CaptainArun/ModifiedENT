import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-view-billing-setup',
    templateUrl: './view-billing-setup.component.html',
    styleUrls: ['./view-billing-setup.component.css']
  })

export class ViewBillingSetupComponent implements OnInit {

  //#region "constructor"
 constructor(public dialog: MatDialogRef<ViewBillingSetupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
 //#endregion

  //#region "ngOnInit"
  ngOnInit() { }
   //#endregion

    //#region "dialogClose"
    dialogClose() {
      this.dialog.close();
  }
     //#endregion

  }
