import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewPatientService } from '../../newPatient.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-radiology-view',
  templateUrl: './radiology-view.component.html',
  styleUrls: ['./radiology-view.component.css']
})
export class RadiologyViewComponent implements OnInit {
  RadiologyOrderViewForm: FormGroup;
  patientId: number = 1;
  radiologyRec: any;

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<RadiologyViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public newPatientSvc: NewPatientService) { }

  ngOnInit() {
    this.RadiologyOrderViewForm = this.fb.group({
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      RecordedTime: [''],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['', Validators.required]
    })
    this.getRadiologyRecord();
    this.setRadiologyView();
    this.RadiologyOrderViewForm.disable();
  }

  setRadiologyView() {
    this.RadiologyOrderViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.RadiologyOrderViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.RadiologyOrderViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.RadiologyOrderViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
    this.RadiologyOrderViewForm.get('recordedDuring').setValue(this.data.recordedDuring);
  }

  getRadiologyRecord() {
    this.newPatientSvc.getRadiologyRecord(this.patientId).then(res => {
      this.radiologyRec = res;
    });
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
