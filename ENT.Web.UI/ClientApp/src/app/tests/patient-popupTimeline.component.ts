import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material'

@Component({
  selector: 'patient-popupTimeline',
  templateUrl: 'patient-popupTimeline.component.html'
})

export class PatientPopupTimelineComponent {
    
    constructor( public dialogRef: MatDialogRef<PatientPopupTimelineComponent>) {}  
      
    onNoClick(): void {
        this.dialogRef.close();
      }

}
