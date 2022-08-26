import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'triage-visitIntakedPopup',
  templateUrl: 'triage-visitIntakedPopup.component.html'
})

export class TriageVisitIntakedPopupComponent {
  
  constructor( public dialogRef: MatDialogRef<TriageVisitIntakedPopupComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}