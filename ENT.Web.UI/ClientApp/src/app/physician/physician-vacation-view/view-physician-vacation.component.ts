import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-physician-vacation',
  templateUrl: './view-physician-vacation.component.html',
  styleUrls: ['./view-physician-vacation.component.css']
})
export class ViewPhysicianvacationComponent implements OnInit {

  //#region "Constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewPhysicianvacationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  //#endregion

  //#region "ngOnInit"
  ngOnInit() {
  
  }
    //#endregion

  //#region "dialogClose"
  dialogClose(): void {
    this.dialogRef.close();
  }
  //#endregion
}
