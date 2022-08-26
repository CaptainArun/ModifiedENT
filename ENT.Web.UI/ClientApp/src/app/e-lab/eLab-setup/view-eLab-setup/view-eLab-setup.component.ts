import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'app-view-elab-setup',
    templateUrl: './view-elab-setup.component.html',
    styleUrls: ['./view-elab-setup.component.css']
  })

  export class ViewElabSetupComponent implements OnInit { 
    //#region Constructor
    constructor(public dialog: MatDialogRef<ViewElabSetupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
    //#endregion Constructor

    //#region ngOnInit
    ngOnInit() { }
     //#endregion ngOnInit     

    //#region close the Form
    close() {
      this.dialog.close();
    }
    //#endregion close the Form
  }