import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'consult-visitsummary',
  templateUrl: 'consult-visitSummary.component.html'
})

export class ConsultVisitSummaryComponent {
 
selected = 'option1';
  disableSelect = true;

  constructor( public dialogRef: MatDialogRef<ConsultVisitSummaryComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
