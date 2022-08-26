import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProcedureModel } from '../../../triage/models/procedureModel';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TriageService } from '../../../triage/triage.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { NewPatientService } from '../../newPatient.service';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-procedure',
  templateUrl: './add-procedure.component.html',
  styleUrls: ['./add-procedure.component.css']
})
export class AddProcedureComponent implements OnInit, AfterViewInit {
  ProcedureForm: FormGroup;
  procedureModel: ProcedureModel = new ProcedureModel();
  requestedProcedures: any;
  ICDCodes: any;
  CPTCodes: any;
  patientId: number = 1;
  visitDandt: any[] = [];
  visitID: number;
  recordedDuring: any = '';
  facilityId: number = 0;
  recordby: string;
  isReferedLab: boolean = false;
  getTimeHH: any;
  getDate: any;
  getTimeMin: any;
  getDateAndTime: any;
  procedureStatus: any;
  treatmentType: any;
  reqProcedureTooltip: any[] = [];
  reqPro: any;
  icdTooltip: any;
  cptTooltip: any;
  time: string;

  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private triageSvc: TriageService, private customHttpSvc: CustomHttpService, public dialogRef: MatDialogRef<AddProcedureComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, public newPatSvc: NewPatientService, private util: UtilService) { }

  ngOnInit() {
    this.ProcedureForm = this.fb.group({
      VisitDateandTime: ['', Validators.required],
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      recordedDuring: ['', Validators.required],
      ChiefComplaint: ['', Validators.required],
      DiagnosisNotes: [''],
      TreatmentType: ['', Validators.required],
      RequestedprocedureId: [''],
      ProcedureNotes: ['', Validators.required],
      ProcedureStatus: ['', Validators.required],
      Proceduredate: [''],
      PrimaryICD: [''],
      PrimaryCPT: [''],
      Recommendedtest: [''],
      NotesandInstructions: [''],
      AdditionalNotes: [''],
      FollowUpNotes: [''],
      ReferralNotes: [''],
      IsReferred: [''],
    });
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));
    this.getProviderNames();
    this.getVisitForPatient();
    this.bindICDCode();
    this.bindTreatmentCode();
    this.bindAllRequestedProcedures();
    this.bindProcedureStatus();
    this.bindTreatmentTypes();
    this.changeTime();
    this.ProcedureForm.get('RecordedDate').setValue(new Date());
    this.ProcedureForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.ProcedureForm.get('PrimaryCPT').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.ProcedureForm.get('PrimaryICD').setValue('');
        }
      });
  }

  changeTime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
  }

  bindICDCode() {
    if (this.ProcedureForm.get('PrimaryICD').value != null) {
      this.ProcedureForm.get('PrimaryICD').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllDiagnosisCodes(key).then(data => {
                this.ICDCodes = data;
              });
            } 
            else {
              this.ICDCodes = null;
              this.icdTooltip = null;
            }
          }
          else {
            this.ICDCodes = null;
            this.icdTooltip = null;
          }
        });
    }
  }

  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }

  bindAllRequestedProcedures() {
    this.triageSvc.getAllRequestedProcedures().then(data => {
      this.requestedProcedures = data;
    });
  }

  setReqProcedureTooltip() {
    this.reqProcedureTooltip = [];
    this.reqPro = this.ProcedureForm.get('RequestedprocedureId').value;
    for (const option of this.requestedProcedures) {
      for (const i of this.reqPro) {
        if (i == option.RequestedProcedureId) {
          this.reqProcedureTooltip.push(option.RequestedProcedureDescription);
        }
      }
    }
  }

  bindProcedureStatus() {
    this.triageSvc.getProcedureStatus().then(data => {
      this.procedureStatus = data;
    });
  }

  bindTreatmentTypes() {
    this.triageSvc.getTreatmentTypes().then(data => {
      this.treatmentType = data;
    });
  }

  bindTreatmentCode() {
    if (this.ProcedureForm.get('PrimaryCPT').value != null) {
      this.ProcedureForm.get('PrimaryCPT').valueChanges.subscribe(
        (key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageSvc.getAllTreatmentCodes(key).then(data => {
                this.CPTCodes = data;
              });
            }
            else {
              this.CPTCodes = null;
              this.cptTooltip = null;
            }
          }
          else {
            this.CPTCodes = null;
            this.cptTooltip = null;
          }
        });
    }
  }

  setCPTTooltip(value1, value2) {
    this.cptTooltip = value1 + ' ' + value2;
  }

  isRefered(event) {
    this.isReferedLab = event.checked;
    if (this.isReferedLab == false) {
      this.ProcedureForm.get('ReferralNotes').reset();
    }
  }

  getVisitForPatient() {
    this.triageSvc.getVisitForPatient(this.newPatSvc.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
      }
    })
  }

  RecordedDuring(index: any) {
    this.triageSvc.getVisitForPatient(this.newPatSvc.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.ProcedureForm.get('recordedDuring').setValue(this.recordedDuring);
        }
      }
    })
  }

  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    })
  }

  sendDateWithTime() {
    this.getDate = new Date(this.ProcedureForm.get("RecordedDate").value);

    if (this.ProcedureForm.get("RecordedDate").value != "") {
      if (this.ProcedureForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.ProcedureForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.ProcedureForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.ProcedureForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.ProcedureForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.ProcedureForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.ProcedureForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }

  addUpdateProcedure() {
    if (this.ProcedureForm.valid) {
      this.sendDateWithTime();
      this.procedureModel.procedureId = 0;
      this.procedureModel.VisitID = this.visitID;
      this.procedureModel.RecordedDate = this.getDateAndTime;
      this.procedureModel.RecordedBy = this.ProcedureForm.get('RecordedBy').value;
      this.procedureModel.ChiefComplaint = this.ProcedureForm.get('ChiefComplaint').value;
      this.procedureModel.DiagnosisNotes = this.ProcedureForm.get('DiagnosisNotes').value;
      this.procedureModel.PrimaryICD = this.ProcedureForm.get('PrimaryICD').value;
      this.procedureModel.TreatmentType = this.ProcedureForm.get('TreatmentType').value;
      this.procedureModel.RequestedprocedureId = this.ProcedureForm.get('RequestedprocedureId').value.toString();
      this.procedureModel.ProcedureNotes = this.ProcedureForm.get('ProcedureNotes').value;
      this.procedureModel.PrimaryCPT = this.ProcedureForm.get('PrimaryCPT').value;
      this.procedureModel.Proceduredate = this.ProcedureForm.get('Proceduredate').value;
      this.procedureModel.ProcedureStatus = this.ProcedureForm.get('ProcedureStatus').value;
      this.procedureModel.IsReferred = this.isReferedLab;
      this.procedureModel.ReferralNotes = this.ProcedureForm.get('ReferralNotes').value;
      this.procedureModel.FollowUpNotes = this.ProcedureForm.get('FollowUpNotes').value;
      this.procedureModel.AdditionalNotes = this.ProcedureForm.get('AdditionalNotes').value;

      this.triageSvc.addUpdateProcedureForVisitcase(this.procedureModel).then(data => {
        this.util.showMessage('', 'Procedure details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
          if (res === true) {
            this.dialogRef.close('update');
          }
        });
      });
    }
  }

  clearForm() {
    this.recordedDuring = '';
    this.isReferedLab = false;
    this.ProcedureForm.reset();
    this.ProcedureForm.get('RecordedDate').setValue(new Date());
    this.ProcedureForm.get('RecordedTime').setValue(this.time);
    this.ProcedureForm.get('RecordedTime').setValue(null);
    this.ProcedureForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  dialogClose(): void {
    this.dialogRef.close();
  }
  
}
