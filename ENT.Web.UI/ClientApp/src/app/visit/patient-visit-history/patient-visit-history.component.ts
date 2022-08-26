import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
    selector: 'patient-visit-history',
    templateUrl: './patient-visit-history.component.html',
    styleUrls: ['./patient-visit-history.component.css']
})

export class PatientVisitHistoryComponent {
    
    constructor(public dialogRef: MatDialogRef<PatientVisitHistoryComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    close() {
        this.dialogRef.close();
    }
}
