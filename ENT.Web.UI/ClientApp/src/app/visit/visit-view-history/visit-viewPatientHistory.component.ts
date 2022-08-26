import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'


@Component({
  selector: 'visit-viewPatientHistory',
  templateUrl: 'visit-viewPatientHistory.component.html', 
  styleUrls: ['./visit-viewPatientHistory.component.css']
})

export class VisitViewPatientHistoryComponent {
 selected = 'option1';
  disableSelect = true;

  constructor(public dialogRef: MatDialogRef<VisitViewPatientHistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }  
   close(): void {
        this.dialogRef.close();
      }
}
