import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material'

@Component({
  selector: 'patient-popupTimeline-v',
  templateUrl: 'patient-popupTimeline-v.component.html'
})

export class PatientPopupTimelineVComponent {
    
    constructor( public dialogRef: MatDialogRef<PatientPopupTimelineVComponent>) {}  
      
    onNoClick(): void {
        this.dialogRef.close();
      }

}
