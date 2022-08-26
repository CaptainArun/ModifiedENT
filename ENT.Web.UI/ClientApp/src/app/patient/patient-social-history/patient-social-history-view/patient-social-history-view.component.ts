import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-patient-social-history-view',
  templateUrl: './patient-social-history-view.component.html',
  styleUrls: ['./patient-social-history-view.component.css']
})
export class PatientSocialHistoryViewComponent implements OnInit {
  smokingData: string;

  SocialHistViewForm: FormGroup
  DrinkingData: string;
  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<PatientSocialHistoryViewComponent>, @Inject(MAT_DIALOG_DATA) public data1: any) {
}
  
  ngOnInit() {
    this.SocialHistViewForm = this.fb.group({

        RecordedDate: [''],
        RecordedBy: [''],
        recordedDuring: [''],
        RecordedTime: [''],
      visitDateandTime: [''],

    })
    this.SocialHistViewForm.disable();
    this.smokingsts();
    this.DrinkingSts();
    this.setSocialView();
  }
  smokingsts() {
    if (this.data1.Smoking == 1) {
      this.smokingData = "Yes";
    }
    if (this.data1.Smoking == 2) {
      this.smokingData = "No";
    }
    if (this.data1.Smoking == 3) {
      this.smokingData="Ocassional"
    }
  }

  DrinkingSts() {
    if (this.data1.Drinking == 1) {
      this.DrinkingData = "Yes";
    }
    if (this.data1.Drinking == 2) {
      this.DrinkingData = "No";
    }
    if (this.data1.Drinking == 3) {
      this.DrinkingData = "Occasional";
    }
  }

  setSocialView() {
    this.SocialHistViewForm.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.SocialHistViewForm.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.SocialHistViewForm.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.SocialHistViewForm.get('visitDateandTime').setValue(this.data1.visitDateandTime);
    this.SocialHistViewForm.get('recordedDuring').setValue(this.data1.recordedDuring);
  }


  dialogClose(): void {
    this.dialogRef.close();
  }
}
