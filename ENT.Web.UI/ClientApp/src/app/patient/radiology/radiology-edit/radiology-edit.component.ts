import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { NewPatientService } from '../../newPatient.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { radiologyModel } from '../../models/RadiologyModel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { CustomHttpService } from 'src/app/core/custom-http.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-radiology-edit',
  templateUrl: './radiology-edit.component.html',
  styleUrls: ['./radiology-edit.component.css']
})

export class RadiologyEditComponent implements OnInit, AfterViewInit {
  RadiologyOrderEditForm: FormGroup;
  RadiologyOrderEditModel: radiologyModel = new radiologyModel();
  icd: any;
  cpt: any;
  patientId: number = 1;
  recordedDuring: any = '';
  facilityID: number = 0;
  isReferedLab: boolean = false;
  datesTime: Date;
  visitDandT: any[] = [];
  identification: any[] = [];
  recordby: any[] = [];
  providerName: any;
  radiologyProcedure: any;
  Type: any;
  procedureStatus: any;
  referredLabValue: any;
  reportFormat: any;
  bodySection: any;
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  cptTooltip: any;
  icdTooltip: any;
  physicianTooltip: any;

  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  constructor(public patientService: NewPatientService, public fb: FormBuilder, private customHttpSvc: CustomHttpService, public dialogRef: MatDialogRef<RadiologyEditComponent>, @Inject(MAT_DIALOG_DATA) public radiologyData: any, private util: UtilService) { }

  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem('DatabaseName'));

    this.RadiologyOrderEditForm = this.fb.group({
      RadiologyID: [''],
      VisitID: [''],
      RecordedDate: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      OrderingPhysician: ['', Validators.required],
      NarrativeDiagnosis: [''],
      PrimaryICD: [''],
      RadiologyProcedure: ['', Validators.required],
      Type: ['', Validators.required],
      Section: ['', Validators.required],
      ContrastNotes: [''],
      PrimaryCPT: ['', Validators.required],
      ProcedureRequestedDate: ['', Validators.required],
      ProcedureRequestTime: ['', Validators.required],
      InstructionsToPatient: [''],
      ProcedureStatus: ['', Validators.required],
      ReferredLab: [''],
      ReferredLabValue: [''],
      ReportFormat: ['', Validators.required],
      AdditionalInfo: [''],
      RecordedTime: ['', Validators.required],
      visitDateandTime: ['', Validators.required],
      recordedDuring: ['', Validators.required]
    });
    this.setRadiologyData();
    this.getRadiologyRecord();
    this.getProviderName();
    this.getProviderNameBySearch();
    this.bindRadiologyProcedureRequest();
    this.bindRadiologyType();
    this.bindProcedureStatus();
    this.bindReferredLab();
    this.bindReportFormat();
    this.bindBodySection();
    this.getICDcode();
    this.getCPTcode();
    this.RadiologyOrderEditForm.get('visitDateandTime').disable();
    this.RadiologyOrderEditForm.get('recordedDuring').disable();
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.RadiologyOrderEditForm.get('OrderingPhysician').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
            this.RadiologyOrderEditForm.get('PrimaryICD').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.RadiologyOrderEditForm.get('PrimaryCPT').setValue('');
        }
      });
  }

  setRadiologyData() {
    this.RadiologyOrderEditForm.get('RadiologyID').setValue(this.radiologyData.RadiologyID);
    this.RadiologyOrderEditForm.get('VisitID').setValue(this.radiologyData.VisitID);
    this.RadiologyOrderEditForm.get('RecordedDate').setValue(new Date(this.radiologyData.RecordedDate));
    this.RadiologyOrderEditForm.get('RecordedTime').setValue(new Date(this.radiologyData.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.RadiologyOrderEditForm.get('RecordedBy').setValue(this.radiologyData.RecordedBy);
    this.RadiologyOrderEditForm.get('OrderingPhysician').setValue(this.radiologyData.OrderingPhysician);
    this.physicianTooltip = this.radiologyData.OrderingPhysician;
    this.RadiologyOrderEditForm.get('NarrativeDiagnosis').setValue(this.radiologyData.NarrativeDiagnosis);
    this.RadiologyOrderEditForm.get('PrimaryICD').setValue(this.radiologyData.PrimaryICD);
    this.icdTooltip = this.radiologyData.PrimaryICD;
    this.RadiologyOrderEditForm.get('RadiologyProcedure').setValue(this.radiologyData.RadiologyProcedure);
    this.RadiologyOrderEditForm.get('Type').setValue(this.radiologyData.Type);
    this.RadiologyOrderEditForm.get('Section').setValue(this.radiologyData.Section);
    this.RadiologyOrderEditForm.get('ContrastNotes').setValue(this.radiologyData.ContrastNotes);
    this.RadiologyOrderEditForm.get('PrimaryCPT').setValue(this.radiologyData.PrimaryCPT);
    this.cptTooltip = this.radiologyData.PrimaryCPT;
    this.RadiologyOrderEditForm.get("ProcedureRequestedDate").setValue(new Date(this.radiologyData.ProcedureRequestedDate));
    this.RadiologyOrderEditForm.get("ProcedureRequestTime").setValue(new Date(this.radiologyData.ProcedureRequestedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.RadiologyOrderEditForm.get('InstructionsToPatient').setValue(this.radiologyData.InstructionsToPatient);
    this.RadiologyOrderEditForm.get('ProcedureStatus').setValue(this.radiologyData.ProcedureStatus);
    this.RadiologyOrderEditForm.get('ReferredLab').setValue(this.radiologyData.ReferredLab);
    this.RadiologyOrderEditForm.get('ReferredLabValue').setValue(this.radiologyData.ReferredLabValue);
    this.RadiologyOrderEditForm.get('ReportFormat').setValue(this.radiologyData.ReportFormat);
    this.RadiologyOrderEditForm.get('AdditionalInfo').setValue(this.radiologyData.AdditionalInfo);
    this.RadiologyOrderEditForm.get('visitDateandTime').setValue(this.radiologyData.visitDateandTime);
    this.RadiologyOrderEditForm.get('recordedDuring').setValue(this.radiologyData.recordedDuring);
    this.isReferedLab = this.RadiologyOrderEditForm.get('ReferredLab').value;
  }

  getRadiologyRecord() {
    this.patientService.GetVisitsForPatient(this.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandT[i] = res[i].VisitDateandTime;
        this.identification[i] = res[i].VisitId;
      }
    });
  }

  getProviderNameBySearch() {
    this.RadiologyOrderEditForm.get('OrderingPhysician').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.patientService.GetProviderNamesBySearch(key).then(data => {
              if (data != null && data != undefined) {
                this.providerName = data;
              }
            });
          }
          else {
            this.providerName = null;
            this.physicianTooltip = null;
          }
        }
        else {
          this.providerName = null;
          this.physicianTooltip = null;
        }
      });
  }

  setPhysicianTooltip(value) {
    this.physicianTooltip = value;
  }

  getICDcode() {
    this.RadiologyOrderEditForm.get('PrimaryICD').valueChanges.subscribe(
      (key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.patientService.GetICDCodesbySearch(key).then(data => {
              this.icd = data;
            });
          }
          else {
            this.icd = null;
            this.icdTooltip = null;
          }
        }
        else {
          this.icd = null;
          this.icdTooltip = null;
        }
      });
  }

  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }

  getCPTcode() {
    this.RadiologyOrderEditForm.get('PrimaryCPT').valueChanges.subscribe(
      (key1: string) => {
        if (key1 != null) {
          if (key1.length > 2) {
            this.patientService.GetCPTCodesbySearch(key1).then(data => {
              this.cpt = data;
            });
          }
          else {
            this.cpt = null;
            this.cptTooltip = null;
          }
        }
        else {
          this.cpt = null;
          this.cptTooltip = null;
        }
      });
  }

  setCPTTooltip(value1, value2) {
    this.cptTooltip = value1 + ' ' + value2;
  }

  RecordedDuring(index: any) {
    this.patientService.GetVisitsForPatient(this.patientService.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
        }
      }
    });
  }

  getProviderName() {
    this.patientService.GetProviderNames(this.facilityID).then(res => {
      this.recordby = res;
    });
  }

  bindRadiologyProcedureRequest() {
    this.patientService.getRadiologyProcedureRequest().then(data => {
      this.radiologyProcedure = data;
    });
  }

  bindRadiologyType() {
    this.patientService.getRadiologyType().then(data => {
      this.Type = data;
    });
  }

  bindProcedureStatus() {
    this.patientService.getProcedureStatus().then(data => {
      this.procedureStatus = data;
    });
  }

  bindReferredLab() {
    this.patientService.getReferredLab().then(data => {
      this.referredLabValue = data;
    });
  }

  bindReportFormat() {
    this.patientService.getReportFormatsforPatient().then(data => {
      this.reportFormat = data;
    });
  }

  bindBodySection() {
    this.patientService.getBodySectionsforPatient().then(data => {
      this.bodySection = data;
    });
  }

  isRefered(event) {
    this.isReferedLab = event.checked;
    if (this.isReferedLab == false) {
      this.RadiologyOrderEditForm.get('ReferredLabValue').reset();
    }
  }

  dateTime() {
    var ProcedureRequestDate: Date;
    var ProcedureRequestTimeHH: number;
    var ProcedureRequestTimemin: number;

    ProcedureRequestDate = new Date(this.RadiologyOrderEditForm.get("ProcedureRequestedDate").value);
    if (this.RadiologyOrderEditForm.get("ProcedureRequestedDate").value != "") {
      if (this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          ProcedureRequestTimeHH = 12;
        }
        else {
          ProcedureRequestTimeHH = parseInt(this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          ProcedureRequestTimeHH = 0;
        }
        else {
          ProcedureRequestTimeHH = parseInt(this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      ProcedureRequestTimemin = parseInt(this.RadiologyOrderEditForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[1]);
      ProcedureRequestDate.setHours(ProcedureRequestTimeHH, ProcedureRequestTimemin, 0, 0);
    }
    this.datesTime = ProcedureRequestDate;
  }

  sendDateWithTime() {
    this.getDate = new Date(this.RadiologyOrderEditForm.get("RecordedDate").value);
  
    if (this.RadiologyOrderEditForm.get("RecordedDate").value != "") {
      if (this.RadiologyOrderEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.RadiologyOrderEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RadiologyOrderEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.RadiologyOrderEditForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.RadiologyOrderEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RadiologyOrderEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.RadiologyOrderEditForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  updateData() {
    if (this.RadiologyOrderEditForm.valid) {
      this.dateTime();
      this.sendDateWithTime();
      this.RadiologyOrderEditModel.RadiologyID = this.RadiologyOrderEditForm.get('RadiologyID').value;
      this.RadiologyOrderEditModel.VisitID = this.radiologyData.VisitID;
      this.RadiologyOrderEditModel.RecordedDate = this.getDateAndTime;
      this.RadiologyOrderEditModel.RecordedBy = this.RadiologyOrderEditForm.get('RecordedBy').value;
      this.RadiologyOrderEditModel.OrderingPhysician = this.RadiologyOrderEditForm.get('OrderingPhysician').value;
      this.RadiologyOrderEditModel.NarrativeDiagnosis = this.RadiologyOrderEditForm.get('NarrativeDiagnosis').value;
      this.RadiologyOrderEditModel.PrimaryICD = this.RadiologyOrderEditForm.get('PrimaryICD').value;
      this.RadiologyOrderEditModel.RadiologyProcedure = this.RadiologyOrderEditForm.get('RadiologyProcedure').value;
      this.RadiologyOrderEditModel.Type = this.RadiologyOrderEditForm.get('Type').value;
      this.RadiologyOrderEditModel.Section = this.RadiologyOrderEditForm.get('Section').value.toString();
      this.RadiologyOrderEditModel.ContrastNotes = this.RadiologyOrderEditForm.get('ContrastNotes').value;
      this.RadiologyOrderEditModel.PrimaryCPT = this.RadiologyOrderEditForm.get('PrimaryCPT').value;
      this.RadiologyOrderEditModel.ProcedureRequestedDate = this.datesTime;
      this.RadiologyOrderEditModel.InstructionsToPatient = this.RadiologyOrderEditForm.get('InstructionsToPatient').value;
      this.RadiologyOrderEditModel.ProcedureStatus = this.RadiologyOrderEditForm.get('ProcedureStatus').value;
      this.RadiologyOrderEditModel.ReferredLab = this.isReferedLab;
      this.RadiologyOrderEditModel.ReferredLabValue = this.RadiologyOrderEditForm.get('ReferredLabValue').value;
      this.RadiologyOrderEditModel.ReportFormat = this.RadiologyOrderEditForm.get('ReportFormat').value.toString();
      this.RadiologyOrderEditModel.AdditionalInfo = this.RadiologyOrderEditForm.get('AdditionalInfo').value;
      this.RadiologyOrderEditModel.RecordedTime = this.RadiologyOrderEditForm.get('RecordedTime').value;
      this.RadiologyOrderEditModel.visitDateandTime = this.RadiologyOrderEditForm.get('visitDateandTime').value;
      this.RadiologyOrderEditModel.recordedDuring = this.RadiologyOrderEditForm.get('recordedDuring').value;
     
      this.patientService.addRadiologyRecord(this.RadiologyOrderEditModel).then(data => {
        this.util.showMessage('', 'Radiology details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
          if (res === true) {
            this.dialogRef.close('update');
          }
        });
      });
    }
  }

  clear() {
    this.setRadiologyData();
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
