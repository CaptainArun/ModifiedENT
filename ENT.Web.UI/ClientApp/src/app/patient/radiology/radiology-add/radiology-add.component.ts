import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { radiologyModel } from '../../models/RadiologyModel';
import { NewPatientService } from '../../newPatient.service';
import { CustomHttpService } from '../../../core/custom-http.service';
import { MatDialogRef } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-radiology-add',
  templateUrl: './radiology-add.component.html',
  styleUrls: ['./radiology-add.component.css']
})
export class RadiologyAddComponent implements OnInit, AfterViewInit {
  RadiologyOrderForm: FormGroup;
  RadiologyOrderModel: radiologyModel = new radiologyModel();
  patientId: number = 1;
  RecordedDuring: any = '';
  visitID: any;
  facilityID: number = 0;
  isReferedLab: boolean = false;
  icd: string;
  cpt: string;
  datesTime: any;
  recordby: any[] = [];
  visitDandT: any[] = [];
  identification: any[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  providerName: any;
  radiologyProcedure: any;
  Type: any;
  procedureStatus: any;
  referredLabValue: any;
  reportFormat: any;
  bodySection: any;
  physicianTooltip: any;
  icdTooltip: any;
  cptTooltip: any;
  time: string;
  
  @ViewChild('autoCompletePhysicianInput', { static: false, read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDInput', { static: false, read: MatAutocompleteTrigger }) trigger1: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTInput', { static: false, read: MatAutocompleteTrigger }) trigger2: MatAutocompleteTrigger;

  constructor(public fb: FormBuilder, public patientService: NewPatientService, public customHttp: CustomHttpService, public dialogRef: MatDialogRef<RadiologyAddComponent>, private util: UtilService) { }

  ngOnInit() {
    this.customHttp.getDbName(localStorage.getItem('DatabaseName'));

    this.RadiologyOrderForm = this.fb.group({
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
    this.getVisitDandT();
    this.getICDcode();
    this.getCPTcode();
    this.getProviderNameBySearch();
    this.getProviderName();
    this.bindRadiologyProcedureRequest();
    this.bindRadiologyType();
    this.bindProcedureStatus();
    this.bindReferredLab();
    this.bindReportFormat();
    this.bindBodySection();
    this.changeTime();
    this.RadiologyOrderForm.get('RecordedDate').setValue(new Date());
    this.RadiologyOrderForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.RadiologyOrderForm.get('OrderingPhysician').setValue('');
        }
      });

    this.trigger1.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
            this.RadiologyOrderForm.get('PrimaryICD').setValue('');
          }
      });

    this.trigger2.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.RadiologyOrderForm.get('PrimaryCPT').setValue('');
        }
      });
  }

  changeTime() {
    this.time = new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'});
  }

  getVisitDandT() {
    this.patientService.GetVisitsForPatient(this.patientService.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandT[i] = res[i].VisitDateandTime;
        this.identification[i] = res[i].VisitId;
      }
    });
  }

  RecordDuring(index: any) {
    this.patientService.GetVisitsForPatient(this.patientService.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.RecordedDuring = data[i].recordedDuring;
          this.visitID = data[i].VisitId;
          this.RadiologyOrderForm.get('recordedDuring').setValue(this.RecordedDuring);
        }
      }
    });
  }

  getProviderName() {
    this.patientService.GetProviderNames(this.facilityID).then(res => {
      this.recordby = res;
    });
  }

  getProviderNameBySearch() {
    this.RadiologyOrderForm.get('OrderingPhysician').valueChanges.subscribe(
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
    this.RadiologyOrderForm.get('PrimaryICD').valueChanges.subscribe(
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
    this.RadiologyOrderForm.get('PrimaryCPT').valueChanges.subscribe(
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
      this.RadiologyOrderForm.get('ReferredLabValue').reset();
    }
  }

  dateTime() {
    var ProcedureRequestDate: Date;
    var ProcedureRequestTimeHH: number;
    var ProcedureRequestTimemin: number;
    ProcedureRequestDate = new Date(this.RadiologyOrderForm.get("ProcedureRequestedDate").value);

    if (this.RadiologyOrderForm.get("ProcedureRequestedDate").value != "") {
      if (this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          ProcedureRequestTimeHH = 12;
        }
        else {
          ProcedureRequestTimeHH = parseInt(this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          ProcedureRequestTimeHH = 0;
        }
        else {
          ProcedureRequestTimeHH = parseInt(this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      ProcedureRequestTimemin = parseInt(this.RadiologyOrderForm.get("ProcedureRequestTime").value.toString().split(' ')[0].toString().split(':')[1]);
      ProcedureRequestDate.setHours(ProcedureRequestTimeHH, ProcedureRequestTimemin, 0, 0);
    }
    this.datesTime = ProcedureRequestDate;
  }

  sendDateWithTime() {
    this.getDate = new Date(this.RadiologyOrderForm.get("RecordedDate").value);

    if (this.RadiologyOrderForm.get("RecordedDate").value != "") {
      if (this.RadiologyOrderForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.RadiologyOrderForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.RadiologyOrderForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.RadiologyOrderForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.RadiologyOrderForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.RadiologyOrderForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.RadiologyOrderForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  submitForm() {
    if (this.RadiologyOrderForm.valid) {
      this.sendDateWithTime();
      this.dateTime();
      this.RadiologyOrderModel.RadiologyID = 1;
      this.RadiologyOrderModel.VisitID = this.visitID;
      this.RadiologyOrderModel.RecordedDate = this.getDateAndTime;
      this.RadiologyOrderModel.RecordedBy = this.RadiologyOrderForm.get('RecordedBy').value;
      this.RadiologyOrderModel.OrderingPhysician = this.RadiologyOrderForm.get('OrderingPhysician').value;
      this.RadiologyOrderModel.NarrativeDiagnosis = this.RadiologyOrderForm.get('NarrativeDiagnosis').value;
      this.RadiologyOrderModel.PrimaryICD = this.RadiologyOrderForm.get('PrimaryICD').value;
      this.RadiologyOrderModel.RadiologyProcedure = this.RadiologyOrderForm.get('RadiologyProcedure').value;
      this.RadiologyOrderModel.Type = this.RadiologyOrderForm.get('Type').value;
      this.RadiologyOrderModel.Section = this.RadiologyOrderForm.get('Section').value.toString();
      this.RadiologyOrderModel.ContrastNotes = this.RadiologyOrderForm.get('ContrastNotes').value;
      this.RadiologyOrderModel.PrimaryCPT = this.RadiologyOrderForm.get('PrimaryCPT').value;
      this.RadiologyOrderModel.ProcedureRequestedDate = this.datesTime;
      this.RadiologyOrderModel.InstructionsToPatient = this.RadiologyOrderForm.get('InstructionsToPatient').value;
      this.RadiologyOrderModel.ProcedureStatus = this.RadiologyOrderForm.get('ProcedureStatus').value;
      this.RadiologyOrderModel.ReferredLab = this.isReferedLab;
      this.RadiologyOrderModel.ReferredLabValue = this.RadiologyOrderForm.get('ReferredLabValue').value;
      this.RadiologyOrderModel.AdditionalInfo = this.RadiologyOrderForm.get('AdditionalInfo').value;
      this.RadiologyOrderModel.ReportFormat = this.RadiologyOrderForm.get('ReportFormat').value.toString();
      this.RadiologyOrderModel.visitDateandTime = this.RadiologyOrderForm.get('visitDateandTime').value;
      this.RadiologyOrderModel.recordedDuring = this.RecordedDuring;
    
      this.patientService.addRadiologyRecord(this.RadiologyOrderModel).then(data => {
        this.util.showMessage('', 'Radiology details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { 
          if (res === true) {
            this.dialogRef.close('update');
          }
        });
      });
    }
  }

  cancelForm() {
    this.RecordedDuring = '';
    this.isReferedLab = false;
    this.RadiologyOrderForm.reset();
    this.RadiologyOrderForm.get('RecordedDate').setValue(new Date());
    this.RadiologyOrderForm.get('RecordedTime').setValue(this.time);
    this.RadiologyOrderForm.get('RecordedTime').setValue(null);
    this.RadiologyOrderForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
  }

  dialogClose(): void {
    this.dialogRef.close();
  }

}
