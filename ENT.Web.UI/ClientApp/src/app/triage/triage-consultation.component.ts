import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'triage-consultation',
  templateUrl: 'triage-consultation.component.html'
})

export class TriageConsultationComponent implements OnInit {
  selected = 'option1';
  disableSelect = true;

  triageConsultationForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<TriageConsultationComponent>, private fb: FormBuilder) { }

  ngOnInit() {
    this.triageConsultationForm = this.fb.group({
      //Tab1
      RecordedDuring: [''],
      VisitDate1: [''],
      VisitDate2: [''],
      VisitTime: [''],
      //Tab2
      AudiologyRecordedDuring: [''],
      AudiologyVisitDate1: [''],
      AudiologyVisitDate2: [''],
      AudiologyVisitTime: [''],
      //Tab3
      SpeechRecordedDuring: [''],
      SpeechVisitDate1: [''],
      SpeechVisitDate2: [''],
      SpeechVisitTime: [''],
      RightSTR: [''],
      RightWDS: [''],
      RightLeave: [''],
      RightMask: [''],
      RightUCL: [''],
      LeftSTR: [''],
      LeftWDS: [''],
      LeftLeave: [''],
      LeftMask: [''],
      LeftUCL: [''],
      RightType: [''],
      RightPreAndSure: [''],
      RightVolume: [''],
      RightCompliance: [''],
      RightReflex: [''],
      LeftType: [''],
      LeftPreAndSure: [''],
      LeftVolume: [''],
      LeftCompliance: [''],
      LeftReflex: [''],
      Observations: [''],
      Recommendations: [''],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
