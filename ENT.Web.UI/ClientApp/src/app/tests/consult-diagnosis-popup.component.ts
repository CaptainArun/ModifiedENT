import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material'

@Component({
  selector: 'consult-diagnosis-popup',
  templateUrl: 'consult-diagnosis-popup.component.html'
})

export class ConsultDiagnosisPopupComponent {
    
    constructor( public dialogRef: MatDialogRef<ConsultDiagnosisPopupComponent>) {}  
      
    onNoClick(): void {
        this.dialogRef.close();
      }

}
