import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'


@Component({
  selector: 'visit-viewVisitIntake',
  templateUrl: 'visit-viewVisitIntake.component.html', 
  styleUrls: ['./visit-viewVisitIntake.component.css']
})

export class VisitViewVisitIntakeComponent {
 selected = 'option1';
  disableSelect = true;

  constructor(public dialogRef: MatDialogRef<VisitViewVisitIntakeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

  }  
   close(): void {
        this.dialogRef.close();
      }
}
