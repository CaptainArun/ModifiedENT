import { Component, OnInit, Inject } from '@angular/core';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-family-health-history-view',
  templateUrl: './family-health-history-view.component.html',
  styleUrls: ['./family-health-history-view.component.css']
})
export class FamilyHealthHistoryViewComponent implements OnInit {
  patientID: number = 1;

  familyHealthHistoryViewForm: FormGroup;

  constructor(public fb: FormBuilder, public dialogRef: MatDialogRef<FamilyHealthHistoryViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.familyHealthHistoryViewForm = this.fb.group({
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      visitDateandTime: [''],
      recordedDuring: ['']

    })
    this.familyHealthHistoryViewForm.disable();
    this.SetfamilyView();
    
  }

  SetfamilyView() {
    this.familyHealthHistoryViewForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.familyHealthHistoryViewForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.familyHealthHistoryViewForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.familyHealthHistoryViewForm.get('visitDateandTime').setValue(this.data.visitDateandTime);
    this.familyHealthHistoryViewForm.get('recordedDuring').setValue(this.data.recordedDuring);

  }
  
  dialogClose(): void {
    this.dialogRef.close();
  }
  
  
}
