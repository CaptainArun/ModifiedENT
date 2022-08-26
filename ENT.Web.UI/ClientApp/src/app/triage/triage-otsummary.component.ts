import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material'


@Component({
  selector: 'triage-opdsummary',
  templateUrl: 'triage-otsummary.component.html'
})

export class TriageOtSummaryComponent {
  constructor( public dialogRef: MatDialogRef<TriageOtSummaryComponent>) {}  
      
    onNoClick(): void {
        this.dialogRef.close();
      }


}
