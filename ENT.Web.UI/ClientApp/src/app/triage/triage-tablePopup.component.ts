import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'triage-tablePopup',
  templateUrl: 'triage-tablePopup.component.html'
})

export class TriageTablePopupComponent {
  
  constructor( public dialogRef: MatDialogRef<TriageTablePopupComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
  dialogClose() {
    this.dialogRef.close();
  }
}
