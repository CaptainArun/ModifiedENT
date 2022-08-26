import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'triage-ClinicPopup',
  templateUrl: 'triage-ClinicPopup.component.html'
})

export class TriageClinicPopupComponent {
  
  constructor( public dialogRef: MatDialogRef<TriageClinicPopupComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}