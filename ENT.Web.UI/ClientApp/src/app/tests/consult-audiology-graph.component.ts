import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormControl } from "@angular/forms";


@Component({
  selector: 'consult-audiology-graphComponent',
  templateUrl: 'consult-audiology-graph.component.html',
   providers: [],
})

export class ConsultAudiologyGraphComponent {
 
  constructor( public dialogRef: MatDialogRef<ConsultAudiologyGraphComponent>) {}  

  onNoClick(): void {
    this.dialogRef.close();
  }
}