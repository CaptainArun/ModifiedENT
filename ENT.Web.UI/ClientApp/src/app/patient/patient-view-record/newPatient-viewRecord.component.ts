import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'newPatient-viewRecord',
  templateUrl: 'newPatient-viewRecord.component.html', 
  styleUrls: ['./newPatient-viewRecord.component.css']
})

export class NewPatientViewRecordComponent {
 selected = 'option1';
  disableSelect = true;
  constructor(public dialogRef: MatDialogRef<NewPatientViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  dialogClose(): void {
    this.dialogRef.close();
  }
}
