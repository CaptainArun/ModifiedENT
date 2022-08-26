import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-physician-speciality',
  templateUrl: './view-physician-speciality.component.html',
  styleUrls: ['./view-physician-speciality.component.css']
})
export class ViewPhysicianSpecialityComponent implements OnInit {

  //#region "Constructor"
 constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewPhysicianSpecialityComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
