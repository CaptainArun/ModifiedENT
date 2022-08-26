import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'consult-consultation',
  templateUrl: 'consult-consultation.component.html'
})

export class ConsultConsultationComponent {
selected = 'option1';
  disableSelect = true;

  constructor( public dialogRef: MatDialogRef<ConsultConsultationComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}
