import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-drugchart-view-record.',
  templateUrl: './drugchart-view-record.component.html',
  styleUrls: ['./drugchart-view-record.component.css']
})
export class DrugchartViewRecordComponent implements OnInit {
  //#region 
  Preprocedure: FormGroup;
  AdmissionNo: any="";
  AdmissionDateTime: any="";
  RecordedDuring: any="";
  RecordedBy: any="";
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<DrugchartViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.Preprocedure = this.fb.group({
      AdmissionNo: [''],
      RecordedBy: [''],
      admissiondateandtime: [''],
      RecordedDuring: [''],
      RecordedDuringID: ['']
    })
    this.Preprocedure.disable();
    this.setMedicationView();
  }
  //view record
  setMedicationView() {
    this.Preprocedure.get('AdmissionNo').setValue(this.data.AdmissionNo);
    this.Preprocedure.get('admissiondateandtime').setValue(this.data.AdmissionDateandTime);
    this.Preprocedure.get('RecordedDuring').setValue(this.data.recordedDuring);
    this.Preprocedure.get('RecordedBy').setValue(this.data.RecordedBy);
    this.AdmissionNo=this.data.AdmissionNo;
    this.AdmissionDateTime=this.data.AdmissionDateandTime;
    this.RecordedDuring=this.data.recordedDuring;
    this.RecordedBy=this.data.RecordedBy;
  }
  //close
  dialogClose(): void {
    this.dialogRef.close()
  }
   //#endregion 
}
