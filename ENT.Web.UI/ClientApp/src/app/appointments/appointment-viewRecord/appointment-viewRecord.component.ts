import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'appointment-viewRecord',
  templateUrl: 'appointment-viewRecord.component.html',
  styleUrls: ['./appointment-viewRecord.component.css']
})

export class AppointmentViewRecordComponent implements OnInit { 
  
  constructor(public dialogRef: MatDialogRef<AppointmentViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {   
  }

  ngOnInit() { }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
