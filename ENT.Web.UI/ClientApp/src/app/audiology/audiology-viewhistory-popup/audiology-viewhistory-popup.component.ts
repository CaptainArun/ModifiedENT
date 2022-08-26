import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'audiology-viewhistory-popup',
    templateUrl: './audiology-viewhistory-popup.component.html',
    styleUrls: ['./audiology-viewhistory-popup.component.css']
})

export class AudiologyViewHistoryPopupComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AudiologyViewHistoryPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {

    }

    close(): void {
        this.dialogRef.close();
    }

}