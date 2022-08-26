import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-patient-careplan',
  templateUrl: './view-patient-careplan.component.html',
  styleUrls: ['./view-patient-careplan.component.css']
})
export class ViewPatientCarePlanComponent implements OnInit {
  Patientplan: FormGroup;


  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewPatientCarePlanComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.Patientplan = this.fb.group({
      VisitDateandTime: [''],
      RecordedDate: [''],
      RecordedBy: [''],
      RecordedTime: [''],

      recordedDuring: ['']
    })
    this.Patientplan.disable();
    this.setMedicationView();
  }
  setMedicationView() {
    this.Patientplan.get('VisitDateandTime').setValue(this.data.visitDateandTime);
    this.Patientplan.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.Patientplan.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.Patientplan.get('recordedDuring').setValue(this.data.recordedDuring);


    this.Patientplan.get('RecordedBy').setValue(this.data.RecordedBy);

  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
