import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionalCognitiveModel } from '../../../triage/models/functionalCognitiveModel';
import { TriageService } from '../../../triage/triage.service';
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UtilService } from '../../../core/util.service';
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from '../../../ux/bmsmsgbox/bmsmsgbox.component';
import { NewPatientService } from '../../newPatient.service';

@Component({
  selector: 'app-patient-funtion-add',
  templateUrl: './patient-funtion-add.component.html',
  styleUrls: ['./patient-funtion-add.component.css']
})
export class PatientFuntionAddComponent implements OnInit {
  functionalForm: FormGroup;
  funtionCognModel: FunctionalCognitiveModel = new FunctionalCognitiveModel();
  cpt: any;
  icd: any;
  patientId: any;
  visitID: number;
  visitDandt: any[] = [];
  recordedDuring: string = '';
  recordedDuring2: string = '';
  facilityId: number = 0;
  recordby: string[] = [];
  getDate: any;
  getTimeHH: any;
  getTimeMin: any;
  getDateAndTime: any;
  balanceList: any;
  mobilitieslist: any;
  Gaitvalue: any;
  icdtooltip: any;
  cpttooltip: any;

  @ViewChild('autoCompleteICDCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerICDFunction: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTCodeFunction', { static: false, read: MatAutocompleteTrigger }) triggerCPTFunction: MatAutocompleteTrigger;

  constructor(public triageSvc: TriageService, public fb: FormBuilder, public dialogRef: MatDialogRef<PatientFuntionAddComponent>, private util: UtilService, public newPatsvc: NewPatientService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.functionalForm = this.fb.group({
      PatientID: [''],
      VisitID: [''],
      CognitiveID: [''],
      VisitDateandTime: ['', Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
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
    this.patientId = this.data;
    this.bindAllDiagnosisCodes()
    this.bindAllTreatmentCodes();
    this.getVisitForPatient();
    this.getProviderNames();
    this.getBalanceListforIntake();
    this.GetMobilitiesforIntake();
    this.GetGaitvalue();

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
          }
          else {
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
          }
          else {
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
        //this.visitID = res[i].VisitId;

      }
    })

  }
  RecordedDuring(index: any) {
    this.triageSvc.getVisitForPatient(this.patientId).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (i == index) {
          this.recordedDuring = data[index].recordedDuring;
          this.functionalForm.get('recordedDuring').setValue(this.recordedDuring);
          this.visitID = data[i].VisitId;
        }
      }

    });
  }

  getProviderNames() {
    this.triageSvc.getProviderNames(this.facilityId).then(res => {
      this.recordby = res;
    });
  }

  getBalanceListforIntake() {
    this.triageSvc.GetBalanceListforIntake().then(res => {
      this.balanceList = res;
    });
  }

  GetMobilitiesforIntake() {
    this.triageSvc.GetMobilitiesforIntake().then(res => {

      this.mobilitieslist = res;
    });
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

  addUpdateFunctionForm() {
    this.sendDateWithTime();

    this.funtionCognModel.PatientID = this.patientId;
    this.funtionCognModel.VisitID = this.visitID;
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

  cancelForm() {

    this.functionalForm.reset();//VisitDateandTime
  }
  dialogClose(): void {
    this.dialogRef.close();
  }

  //Set icd code
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
  setcptCode(value1, value2) {
    this.cpttooltip = value1 + " " + value2;
  }
}
