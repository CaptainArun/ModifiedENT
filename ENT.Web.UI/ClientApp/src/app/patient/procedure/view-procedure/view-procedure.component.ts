import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-procedure',
  templateUrl: './view-procedure.component.html',
  styleUrls: ['./view-procedure.component.css']
})
export class ViewProcedureComponent implements OnInit {
  ProcedureViewForm: FormGroup;

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewProcedureComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.ProcedureViewForm = this.fb.group({
      visitDateandTime: [''],
      RecordedDate: [''],
      RecordedTime: [''], 
      recordedDuring: [''],
      RecordedBy: ['']
    })
    this.ProcedureViewForm.disable();
    this.setView();
  }

  setView() {
    this.ProcedureViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.ProcedureViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.ProcedureViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.ProcedureViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
    this.ProcedureViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
  }
  
  dialogClose(): void {
    this.dialogRef.close();
  }

}
