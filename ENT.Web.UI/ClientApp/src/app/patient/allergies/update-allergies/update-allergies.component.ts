import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { TriageService } from '../../../triage/triage.service';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PatientAllergyModel } from '../../../triage/models/PatientAllergyModel';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../../core/util.service';

@Component({
  selector: 'app-update-allergies',
  templateUrl: './update-allergies.component.html',
  styleUrls: ['./update-allergies.component.css']
})
export class UpdateAllergiesComponent implements OnInit {

  allergiesEditForm: FormGroup;
  allergyModel: PatientAllergyModel = new PatientAllergyModel;
  recordedDuring: any;
  patientID = 1;
  visitId: number;
  visitDateTime: any[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  facilityId: any;
  recordedBy: any;
  allergyType: any;
  AllergySeverities: any;
  diagnosisCode: any;
  snomedCTCode: any;
  allergyStatusvalue: any;
  icdtooltip: any;
  snoomedtooltip: any;
  recordduring: any;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICD: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCode', { static: false, read: MatAutocompleteTrigger }) triggerSnomed: MatAutocompleteTrigger;

  constructor(public newPatientService: NewPatientService, public custHttp: CustomHttpService, public fb: FormBuilder, public triageService: TriageService, public dialogRef: MatDialogRef<UpdateAllergiesComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService) {
  }
  ngOnInit() {
    this.allergiesEditForm = this.fb.group({
      AllergyId: [''],
      AllergyTypeID: ['', Validators.required],
      Name: ['', Validators.required],
      Allergydescription: [''],
      Aggravatedby: [''],
      Alleviatedby: [''],
      Onsetdate: [''],
      AllergySeverityID: ['', Validators.required],
      Reaction: [''],
      Status: [''],
      ICD10: [''],
      SNOMED: [''],
      Notes: [''],
      VisitDateandTime: ['', Validators.required],
      RecordedDate: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      recordedDuring: ['', Validators.required],
      RecordedBy: ['', Validators.required],
    })

    this.bindVisitDateAndTime();
    this.bindProviderName();
    this.bindAllergyTypes();
    this.bindAllergySeverities();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.setFormValues();
    this.getallergyStatusvalue();
    this.allergiesEditForm.get('recordedDuring').disable();
  }
  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.allergiesEditForm.get('ICD10').setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.allergiesEditForm.get('SNOMED').setValue('');
      }
    });
  }
  //Set data
  setFormValues() {
    this.allergiesEditForm.get('VisitDateandTime').setValue(this.data.visitDateandTime);
    this.allergiesEditForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.allergiesEditForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.allergiesEditForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.allergiesEditForm.get('AllergyTypeID').setValue(this.data.AllergyTypeID);
    this.allergiesEditForm.get('Name').setValue(this.data.Name);
    this.allergiesEditForm.get('Allergydescription').setValue(this.data.Allergydescription);
    this.allergiesEditForm.get('Aggravatedby').setValue(this.data.Aggravatedby);
    this.allergiesEditForm.get('Alleviatedby').setValue(this.data.Alleviatedby);
    this.allergiesEditForm.get('Onsetdate').setValue(this.data.Onsetdate);
    this.allergiesEditForm.get('AllergySeverityID').setValue(this.data.AllergySeverityID);
    this.allergiesEditForm.get('Reaction').setValue(this.data.Reaction);
    this.allergiesEditForm.get('Status').setValue(this.data.Status);
    this.allergiesEditForm.get('ICD10').setValue(this.data.ICD10);
    this.allergiesEditForm.get('SNOMED').setValue(this.data.SNOMED);
    this.allergiesEditForm.get('Notes').setValue(this.data.Notes);
    this.allergiesEditForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.icdtooltip = this.data.ICD10;
    this.snoomedtooltip = this.data.SNOMED;

  }
  //Submit
  updateAllergy() {
    if (this.allergiesEditForm.valid) {
      this.sendDateWithTime();
      this.allergyModel.AllergyId = this.data.AllergyId;
      this.allergyModel.VisitId = this.visitId;
      this.allergyModel.RecordedDate = this.getDateAndTime;
      this.allergyModel.RecordedBy = this.allergiesEditForm.get('RecordedBy').value;
      this.allergyModel.AllergyTypeID = this.allergiesEditForm.get('AllergyTypeID').value;
      this.allergyModel.Name = this.allergiesEditForm.get('Name').value;
      this.allergyModel.Allergydescription = this.allergiesEditForm.get('Allergydescription').value;
      this.allergyModel.Aggravatedby = this.allergiesEditForm.get('Aggravatedby').value;
      this.allergyModel.Alleviatedby = this.allergiesEditForm.get('Alleviatedby').value;
      this.allergyModel.Onsetdate = this.allergiesEditForm.get('Onsetdate').value;
      this.allergyModel.AllergySeverityID = this.allergiesEditForm.get('AllergySeverityID').value;
      this.allergyModel.Reaction = this.allergiesEditForm.get('Reaction').value;
      this.allergyModel.Status = this.allergiesEditForm.get('Status').value;
      this.allergyModel.ICD10 = this.allergiesEditForm.get('ICD10').value;
      this.allergyModel.SNOMED = this.allergiesEditForm.get('SNOMED').value;
      this.allergyModel.Notes = this.allergiesEditForm.get('Notes').value;
      this.newPatientService.AddUpdateAllergiesForVisit(this.allergyModel).then(ipData => {
        this.util.showMessage('', 'Allergy details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
          (res) => { }
        );

        this.dialogRef.close("Updated");
      })
    }
  }
  //Visit Date and Time
  bindVisitDateAndTime() {
    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDateTime[i] = res[i].VisitDateandTime;
        this.visitId = res[i].VisitId;
      }
    });
  }
  //Record During
  RecordedDuring(data: any) {
    this.newPatientService.GetVisitsForPatient(this.newPatientService.patientId).then(res => {
      for (let x = 0; x < res.length; x++) {
        if (x == data) {
          this.recordedDuring = res[x].recordedDuring;
        }
      }
    });
  }
  //Record by
  bindProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then(res => {
      this.recordedBy = res;
    })
  }
  //Allergy type
  bindAllergyTypes() {
    this.triageService.getAllergyTypes().then(data => {
      this.allergyType = data;
    });
  }
  //AllergySeverities
  bindAllergySeverities() {
    this.triageService.getAllergySeverities().then(data => {
      this.AllergySeverities = data;
    });
  }
  //DiagnosisCodes
  bindAllDiagnosisCodes() {

    this.allergiesEditForm.get('ICD10').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllDiagnosisCodes(key).then(data => {
            this.diagnosisCode = data;
          })
        } else {
          this.diagnosisCode = null;
          this.icdtooltip = null;
        }
      }
    });
  }
  //Snomed
  bindAllSnomedCTCodes() {
    this.allergiesEditForm.get('SNOMED').valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllSnomedCTCodes(key).then(data => {
            this.snomedCTCode = data;
          });
        } else {
          this.snomedCTCode = null;
          this.snoomedtooltip = null;
        }
      }
    });
  }
  //Date and time
  sendDateWithTime() {
    this.getDate = new Date(this.allergiesEditForm.get("RecordedDate").value);
    if (this.allergiesEditForm.get("RecordedDate").value != "") {
      if (this.allergiesEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.allergiesEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.allergiesEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.allergiesEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.allergiesEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.allergiesEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.allergiesEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }
  //Close
  closeForm() {
    this.allergiesEditForm.reset();
    this.setFormValues();
  }
  //dialogclose
  dialogClose(): void {
    this.dialogRef.close();
  }
  getallergyStatusvalue() {
    this.triageService.getallergyStatusvalue().then((res) => {
      this.allergyStatusvalue = res;
    });
  }
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
  setSnoomedCode(value1, value2) {
    this.snoomedtooltip = value1 + " " + value2;
  }
}
