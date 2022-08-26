import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionalCognitiveModel } from '../../../triage/models/functionalCognitiveModel';
import { TriageService } from '../../../triage/triage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { NewPatientService } from '../../newPatient.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-patient-funtion-edit',
  templateUrl: './patient-funtion-edit.component.html',
  styleUrls: ['./patient-funtion-edit.component.css']
})
export class PatientFuntionEditComponent implements OnInit, AfterViewInit {
  functionalForm: FormGroup;
  funtionCognModel: FunctionalCognitiveModel = new FunctionalCognitiveModel();
  cpt: any;
  icd: any;
  patientId: any;
  visitID: number;
  visitDandt: any[] = [];
  recordedDuring: any[] = [];
  facilityId: number = 0;
  recordby: string[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  balanceList: any;
  mobilitieslist: any;
  Gaitvalue: any;
  cpttooltip: any;
  icdtooltip: any;
  visitdate: any;

  @ViewChild('autoCompleteICDCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerICDFunction: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerCPTFunction: MatAutocompleteTrigger;

  constructor(public triageSvc: TriageService, public fb: FormBuilder, public dialogRef: MatDialogRef<PatientFuntionEditComponent>, @Inject(MAT_DIALOG_DATA) public data1: any, private util: UtilService, public newPatSvc: NewPatientService) { }

  ngOnInit() {
    this.functionalForm = this.fb.group({
      PatientID: [''],
      VisitID: [''],
      CognitiveID: [''],
      VisitDateandTime: ['', Validators.required],
      RecordedDate: ['', Validators.required],
      RecordedTime: ['', Validators.required],
      recordedDuring: ['', Validators.required],
      RecordedBy: ['', Validators.required],
      Gait: [''],
      /*// IsSideBySide: [''],
      SidebySide: [''],
      //IsSemiTandem: [''],
      Semitandem: [''],*/
      GaitNotes: [''],
      Balance: [''],
      BalanceNotes: [''],
      NeuromuscularNotes: [''],
      Mobility: [''],
      MobilitySupportDevice: [''],
      MobilityNotes: [''],
      Functionalstatus: [''],
      Cognitivestatus: [''],
      PrimaryDiagnosisNotes: [''],
      ICD10: [''],
      PrimaryProcedure: [''],
      CPT: [''],
      Physicianname: [''],
      Hospital: [''],
    });
    this.patientId = this.data1.PatientID;
    this.bindAllDiagnosisCodes()
    this.bindAllTreatmentCodes();
    this.getVisitForPatient();
    this.getProviderNames();
    this.setCognitiveForm();
    this.getBalanceListforIntake();
    this.GetMobilitiesforIntake();
    this.GetGaitvalue();
    this.functionalForm.get('recordedDuring').disable();
  }

  ngAfterViewInit() {

    this.triggerICDFunction.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.functionalForm.get("ICD10").setValue('');
      }
    });

    this.triggerCPTFunction.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.functionalForm.get("CPT").setValue('');
      }
    });
  }

  bindAllTreatmentCodes() {
    this.functionalForm.get('CPT').valueChanges.subscribe(
      (key1: string) => {
        if (key1 != null) {
          if (key1.length > 2) {
            this.triageSvc.getAllTreatmentCodes(key1).then(data => {
              this.cpt = data;

            })
          } else {
            this.cpt = null;
            this.cpttooltip = null;
          }
        }
      })
  }

  bindAllDiagnosisCodes() {
    this.functionalForm.get('ICD10').valueChanges.subscribe(
      (key1: string) => {
        if (key1 != null) {
          if (key1.length > 2) {
            this.triageSvc.getAllDiagnosisCodes(key1).then(data => {
              this.icd = data;
            })
          } else {
            this.icd = null;
            this.icdtooltip = null;
          }
        }
      })
  }

  getVisitForPatient() {
    this.triageSvc.getVisitForPatient(this.patientId).then(res => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        this.visitID = res[i].VisitId;
      }
    })

  }

  RecordedDuring(index: any) {

    this.triageSvc.getVisitForPatient(this.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[i].recordedDuring;
          //this.visitID = data[i].visitID;
        }
      }
    })
  }

  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;

    })
  }

  getBalanceListforIntake() {
    this.triageSvc.GetBalanceListforIntake().then(res => {
      this.balanceList = res;
    })
  }

  GetMobilitiesforIntake() {
    this.triageSvc.GetMobilitiesforIntake().then(res => {
      this.mobilitieslist = res;
    })
  }

  GetGaitvalue() {
    this.triageSvc.GetGaitvalue().then(res => {
      this.Gaitvalue = res;
    });
  }

  sendDateWithTime() {

    this.getDate = new Date(this.functionalForm.get("RecordedDate").value);

    if (this.functionalForm.get("RecordedDate").value != "") {
      if (this.functionalForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "pm") {
        if (parseInt(this.functionalForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 12;
        }
        else {
          this.getTimeHH = parseInt(this.functionalForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) + 12;
        }
      }
      else if (this.functionalForm.get("RecordedTime").value.toString().toLowerCase().split(' ')[1] == "am") {
        if (parseInt(this.functionalForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]) == 12) {
          this.getTimeHH = 0;
        }
        else {
          this.getTimeHH = parseInt(this.functionalForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[0]);
        }
      }
      this.getTimeMin = parseInt(this.functionalForm.get("RecordedTime").value.toString().split(' ')[0].toString().split(':')[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;

  }

  setCognitiveForm() {
    this.functionalForm.get('RecordedDate').setValue(new Date(this.data1.RecordedDate));
    this.functionalForm.get('RecordedTime').setValue(new Date(this.data1.RecordedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.functionalForm.get('RecordedBy').setValue(this.data1.RecordedBy);
    this.functionalForm.get('VisitDateandTime').setValue(this.data1.visitDateandTime);
    this.functionalForm.get('recordedDuring').setValue(this.data1.recordedDuring);
    this.functionalForm.get('Gait').setValue(this.data1.Gait);
    this.functionalForm.get('GaitNotes').setValue(this.data1.GaitNotes);
    this.functionalForm.get('Balance').setValue(this.data1.Balance);
    this.functionalForm.get('BalanceNotes').setValue(this.data1.BalanceNotes);
    this.functionalForm.get('NeuromuscularNotes').setValue(this.data1.NeuromuscularNotes);
    this.functionalForm.get('Mobility').setValue(this.data1.Mobility);
    this.functionalForm.get('MobilitySupportDevice').setValue(this.data1.MobilitySupportDevice);
    this.functionalForm.get('MobilityNotes').setValue(this.data1.MobilityNotes);
    this.functionalForm.get('Functionalstatus').setValue(this.data1.Functionalstatus);
    this.functionalForm.get('Cognitivestatus').setValue(this.data1.Cognitivestatus);
    this.functionalForm.get('PrimaryDiagnosisNotes').setValue(this.data1.PrimaryDiagnosisNotes);
    this.functionalForm.get('ICD10').setValue(this.data1.ICD10);
    this.functionalForm.get('CPT').setValue(this.data1.CPT);
    this.functionalForm.get('PrimaryProcedure').setValue(this.data1.PrimaryProcedure);
    this.functionalForm.get('Physicianname').setValue(this.data1.Physicianname);
    this.functionalForm.get('Hospital').setValue(this.data1.Hospital);
    this.icdtooltip = this.data1.ICD10;
    this.cpttooltip = this.data1.CPT;
    this.visitdate = this.data1.visitDateandTime;
  }

  addUpdateFunctionForm() {
    this.sendDateWithTime();
    this.funtionCognModel.PatientID = this.patientId;
    this.funtionCognModel.VisitID = this.data1.VisitID;
    this.funtionCognModel.CognitiveID = this.data1.CognitiveID;
    this.funtionCognModel.RecordedDate = this.functionalForm.get('RecordedDate').value;
    this.funtionCognModel.RecordedBy = this.functionalForm.get('RecordedBy').value;
    this.funtionCognModel.Gait = this.functionalForm.get('Gait').value;
    this.funtionCognModel.GaitNotes = this.functionalForm.get('GaitNotes').value;
    this.funtionCognModel.Balance = this.functionalForm.get('Balance').value;
    this.funtionCognModel.BalanceNotes = this.functionalForm.get('BalanceNotes').value;
    this.funtionCognModel.NeuromuscularNotes = this.functionalForm.get('NeuromuscularNotes').value;
    this.funtionCognModel.Mobility = this.functionalForm.get('Mobility').value;
    this.funtionCognModel.MobilitySupportDevice = this.functionalForm.get('MobilitySupportDevice').value;
    this.funtionCognModel.MobilityNotes = this.functionalForm.get('MobilityNotes').value;
    this.funtionCognModel.Functionalstatus = this.functionalForm.get('Functionalstatus').value;
    this.funtionCognModel.Cognitivestatus = this.functionalForm.get('Cognitivestatus').value;
    this.funtionCognModel.PrimaryDiagnosisNotes = this.functionalForm.get('PrimaryDiagnosisNotes').value;
    this.funtionCognModel.ICD10 = this.functionalForm.get('ICD10').value;
    this.funtionCognModel.CPT = this.functionalForm.get('CPT').value;
    this.funtionCognModel.PrimaryProcedure = this.functionalForm.get('PrimaryProcedure').value;
    this.funtionCognModel.Physicianname = this.functionalForm.get('Physicianname').value;
    this.funtionCognModel.Hospital = this.functionalForm.get('Hospital').value;

    this.triageSvc.addUpdateFunctionalandCognitiveForVisit(this.funtionCognModel).then(res => {
      this.util.showMessage('', 'Cognitive details saved successfully', BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then(
        (res) => {
          if (res === true) {
            this.dialogRef.close("update");
          }
        }
      );
    });
  }
  dialogClose(): void {
    this.dialogRef.close();
  }

  Clear() {
    this.setCognitiveForm();
  }
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
  setcptCode(value1, value2) {
    this.cpttooltip = value1 + " " + value2;
  }
}
