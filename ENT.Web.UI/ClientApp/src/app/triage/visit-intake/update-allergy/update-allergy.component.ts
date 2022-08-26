import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomHttpService } from '../../../core/custom-http.service';
import { TriageService } from '../../../triage/triage.service';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PatientAllergyModel } from '../../../triage/models/PatientAllergyModel';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { UtilService } from '../../../core/util.service';
import { NewPatientService } from 'src/app/patient/newPatient.service';

@Component({
  selector: 'app-update-allergy',
  templateUrl: './update-allergy.component.html',
  styleUrls: ['./update-allergy.component.css']
})
export class UpdateAllergyComponent implements OnInit {

  allergiesForm: FormGroup;
  allergyModel: PatientAllergyModel = new PatientAllergyModel();
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
  constructor(public newPatientService: NewPatientService, public custHttp: CustomHttpService, public fb: FormBuilder, public triageService: TriageService, public dialogRef: MatDialogRef<UpdateAllergyComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private util: UtilService) {

  }
  ngOnInit() {
    this.allergiesForm = this.fb.group({
      AllergyId: [''],
      AllergyTypeID: ['', Validators.required],
      AllergyTypeDesc: [""],
      AllergySeverityDesc: [""],
      Name: [''],
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
    });

    this.bindProviderName();
    this.bindAllergyTypes();
    this.bindAllergySeverities();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
    this.setFormValues();
    this.getallergyStatusvalue();
  }
  ngAfterViewInit() {
    this.triggerICD.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.allergiesForm.get('ICD10').setValue('');
      }
    });

    this.triggerSnomed.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.allergiesForm.get('SNOMED').setValue('');
      }
    });
  }
  //Set data
  setFormValues() {
    this.allergiesForm.get('VisitDateandTime').setValue(this.data.visitDateandTime);
    this.allergiesForm.get('RecordedDate').setValue(new Date(this.data.RecordedDate));
    this.allergiesForm.get('RecordedBy').setValue(this.data.RecordedBy);
    this.allergiesForm.get('RecordedTime').setValue(new Date(this.data.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit' }));
    this.allergiesForm.get('AllergyTypeID').setValue(this.data.AllergyTypeID);
    this.allergiesForm.get('Name').setValue(this.data.Name);
    this.allergiesForm.get('Allergydescription').setValue(this.data.Allergydescription);
    this.allergiesForm.get('Aggravatedby').setValue(this.data.Aggravatedby);
    this.allergiesForm.get('Alleviatedby').setValue(this.data.Alleviatedby);
    this.allergiesForm.get('Onsetdate').setValue(this.data.Onsetdate != null ? new Date(this.data.Onsetdate) : null);
    this.allergiesForm.get('AllergySeverityID').setValue(this.data.AllergySeverityID);
    this.allergiesForm.get('Reaction').setValue(this.data.Reaction);
    this.allergiesForm.get('Status').setValue(this.data.Status);
    this.allergiesForm.get('ICD10').setValue(this.data.ICD10);
    this.allergiesForm.get('SNOMED').setValue(this.data.SNOMED);
    this.allergiesForm.get('Notes').setValue(this.data.Notes);
    this.allergiesForm.get('recordedDuring').setValue(this.data.recordedDuring);
    this.allergiesForm.get('AllergyTypeDesc').setValue(this.data.AllergyTypeDesc);
    this.allergiesForm.get('AllergySeverityDesc').setValue(this.data.AllergySeverityDesc);
    this.icdtooltip = this.data.ICD10;
    this.snoomedtooltip = this.data.SNOMED;

  }
  //Submit
  updateAllergy() {
    if (this.allergiesForm.valid) {
      this.sendDateWithTime();
      this.allergyModel.AllergyId = this.data.AllergyId;
      this.allergyModel.VisitId = this.visitId;
      this.allergyModel.visitDateandTime = this.allergiesForm.get('VisitDateandTime').value;
      this.allergyModel.recordedDuring = this.allergiesForm.get('recordedDuring').value;
      this.allergyModel.RecordedDate = this.getDateAndTime;
      this.allergyModel.RecordedBy = this.allergiesForm.get('RecordedBy').value;
      this.allergyModel.AllergyTypeID = this.allergiesForm.get('AllergyTypeID').value;
      this.allergyModel.Name = this.allergiesForm.get('Name').value;
      this.allergyModel.Allergydescription = this.allergiesForm.get('Allergydescription').value;
      this.allergyModel.Aggravatedby = this.allergiesForm.get('Aggravatedby').value;
      this.allergyModel.Alleviatedby = this.allergiesForm.get('Alleviatedby').value;
      this.allergyModel.Onsetdate = this.allergiesForm.get('Onsetdate').value;
      this.allergyModel.AllergySeverityID = this.allergiesForm.get('AllergySeverityID').value;
      this.allergyModel.Reaction = this.allergiesForm.get('Reaction').value;
      this.allergyModel.Status = this.allergiesForm.get('Status').value;
      this.allergyModel.ICD10 = this.allergiesForm.get('ICD10').value;
      this.allergyModel.SNOMED = this.allergiesForm.get('SNOMED').value;
      this.allergyModel.Notes = this.allergiesForm.get('Notes').value;
      this.allergyModel.AllergyTypeDesc = this.allergiesForm.get('AllergyTypeDesc').value;
      this.allergyModel.AllergySeverityDesc = this.allergiesForm.get('AllergySeverityDesc').value;
      this.dialogRef.close(this.allergyModel);
    }
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

    this.allergiesForm.get('ICD10').valueChanges.subscribe((key: string) => {
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
    this.allergiesForm.get('SNOMED').valueChanges.subscribe((key: string) => {
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
    this.getDate = new Date(this.allergiesForm.get("RecordedDate").value);
    if (this.allergiesForm.get("RecordedDate").value != "") {
      if (this.allergiesForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.allergiesForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }
  //Close
  closeForm() {
    this.allergiesForm.reset();
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

  //#region Allergy description

  toSetAllergyDesc(AllergyTypeDescription: String) {
    this.allergiesForm.get("AllergyTypeDesc").setValue(AllergyTypeDescription);
  }

  toSetAllergySeverity(description: String) {
    this.allergiesForm.get("AllergySeverityDesc").setValue(description);
  }
  //#endregion Allergy
}
