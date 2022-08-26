import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-patient-visit',
  templateUrl: './view-patient-visit.component.html',
  styleUrls: ['./view-patient-visit.component.css']
})
export class ViewPatientVisitComponent implements OnInit {
  PatientVisitViewForm: FormGroup;
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<ViewPatientVisitComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.PatientVisitViewForm = this.fb.group({
      visitDateandTime: [''],
      RecordedDate: ['', Validators.required],
      RecordedTime: [''],
      recordedDuring: [''],
      RecordedBy: ['', Validators.required],
    })
    this.PatientVisitViewForm.disable();
    this.setMedicationView();
  }
  setMedicationView() {
    this.PatientVisitViewForm.get('RecordedDate').setValue(this.data.RecordedDate);
    this.PatientVisitViewForm.get('RecordedTime').setValue(this.data.RecordedTime);
    this.PatientVisitViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.PatientVisitViewForm.get('visitDateandTime').setValue(this.data.VisitDateandTime);    
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
