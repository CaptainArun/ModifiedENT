import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'consult-tablePopup',
  templateUrl: 'consult-tablePopup.component.html'
})

export class ConsultTablePopupComponent {
  
  constructor( public dialogRef: MatDialogRef<ConsultTablePopupComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
