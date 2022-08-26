import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-drugchart-view-record.',
  templateUrl: './drugchart-view-record.component.html',
  styleUrls: ['./drugchart-view-record.component.css']
})
export class DrugchartViewRecordComponent implements OnInit {

  //#region "property declaration"
  drugview: FormGroup;
  AdmissionNo: any="";
  AdmissionDateTime: any="";
  RecordedDuring: any="";
  RecordedBy: any="";
  //#endregion
  
  //#region "constructor"
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<DrugchartViewRecordComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }
  //#endregion
  
  //#region "ngOnInit"
  ngOnInit() {
    this.drugview = this.fb.group({
      AdmissionNo: [''],
      RecordedBy: [''],
      admissiondateandtime: [''],
      RecordedDuring:[''],
    })
    this.setMedicationView();
    this.drugview.get('AdmissionNo').disable();
    this.drugview.get('admissiondateandtime').disable();
    this.drugview.get('RecordedDuring').disable();
    this.drugview.get('RecordedBy').disable();
  }
  //#endregion
  
  //#region "set"
  setMedicationView() {

    this.drugview.get('AdmissionNo').setValue(this.data.AdmissionNo);
    this.AdmissionNo=this.data.AdmissionNo;
    this.drugview.get('admissiondateandtime').setValue(this.data.AdmissionDateandTime);
    this.AdmissionDateTime=this.data.AdmissionDateandTime
    this.drugview.get('RecordedDuring').setValue(this.data.recordedDuring);
    this.RecordedDuring=this.data.recordedDuring;
    this.drugview.get('RecordedBy').setValue(this.data.RecordedBy);
    this.RecordedBy=this.data.RecordedBy;

  }
  //#endregion
 
  //#region "Close"
  dialogClose(): void {
    this.dialogRef.close()
  }
  //#endregion
}
