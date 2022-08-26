import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AdmissionService } from "../../admission.service";
import { DatePipe } from "@angular/common";
import { NewPatientService } from "../../../patient/newPatient.service";
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import { BMSMessageBoxColorMode, BMSMessageBoxMode } from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { ProcedureConvertModel } from "../../Models/procedure-conertModel";

@Component({
  selector: "app-edit-procedure-convert",
  templateUrl: "./edit-procedure-convert.component.html",
  styleUrls: ["./edit-procedure-convert.component.css"],
})

export class EditProcedureConvertComponent implements OnInit {

  //#region property declaration
  newProcedureForm: FormGroup;
  ProcedureConvertModel: ProcedureConvertModel = new ProcedureConvertModel();
  admissionNumber: any;
  admissiontype: any;
  facilityId: number;
  Admit: any;
  ICDCode1: any;
  ProType: any;
  proname: any;
  CPTCodes: any;
  UrgencyType: any;
  patientArrivalCon: any;
  patientArrBy: any;
  getDate: Date;
  getTimeHH: number;
  getTimeMin: number;
  getDateAndTime: Date;
  pronamenumber: any;
  AdmittingPhysiciannumber: any;
  InitialAdmissionStatus: any;
  visitDandt: [];
  anesthesiaBoolean: boolean;
  bloodBoolean: boolean;
  setcpttooltip: any;
  seticdtooltip: any;

  @ViewChild('autoCompleteProcedureName', { static: false, read: MatAutocompleteTrigger }) triggerProcedureName: MatAutocompleteTrigger;
  @ViewChild('autoCompleteAdmittingPhysician', { static: false, read: MatAutocompleteTrigger }) triggerAdmittingPhysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICDCode: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTCode', { static: false, read: MatAutocompleteTrigger }) triggerCPTCode: MatAutocompleteTrigger;
  //#endregion property declaration

  //#region constructor
  constructor(
    public admissionService: AdmissionService,
    public datePipe: DatePipe,
    public fb: FormBuilder,
    public newPatientService: NewPatientService,
    public dialogRef: MatDialogRef<EditProcedureConvertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private util: UtilService
  ) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.newProcedureForm = this.fb.group({
      AdditionalInfo: [""],
      WardDetails: [""],
      AccompaniedBy: [""],
      InstructionToPatient: [""],
      BloodRequiredCheck: ["", Validators.required],
      AnsthesiaFittnessRequiredCheck: ["", Validators.required],
      PatientExpectStay: [""],
      patientArrivalBy: ["", Validators.required],
      patientArraivalConditon: ["", Validators.required],
      Urgency: ["", Validators.required],
      ProcedureName: ["", Validators.required],
      PlannedProcedure: ["", Validators.required],
      ProcedureType: ["", Validators.required],
      ICDCode: [""],
      CPTCode: [""],
      PreProcedureDiagnosis: ["", Validators.required],
      AdmittingReason: [""],
      AdmittingPhysician: ["", Validators.required],
      AdmissionType: ["", Validators.required],
      AdmissionNo: [""],
      AdmissionTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      AdmissionDate: [new Date(), Validators.required],
      AnesthesiaRequiredDesc: [""],
      BloodRequiredDesc: [""],
      AnesthesiaFitnessRequired: [""],
      BloodRequired: [""],
      AdmissionStatus: ["", Validators.required],
      FacilityName: [this.data.facilityName]
    });
    this.setFormValues();
    this.getadmissionType();
    this.bindAdmittingPhysician();
    this.bindDiagnosisCodes();
    this.getAdmissionNumber();
    this.getProcedureType();
    this.bindProcedureName();
    this.bindTreatmentCode();
    this.getUrgenyId();
    this.getPatientArrivalCondtion();
    this.getPatientArrBy();
    this.getInitialAdmissionStatus();
    this.AdmittingPhysiciannumber = this.data.AdmittingPhysician;
    this.pronamenumber = this.data.ProcedureName;
    this.anesthesiaBoolean = this.data.AnesthesiaFitnessRequired;
    this.bloodBoolean = this.data.BloodRequired;
  }
  ngAfterViewInit() {
    this.triggerProcedureName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.newProcedureForm.get('ProcedureName').setValue('');
      }
    });

    this.triggerAdmittingPhysician.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.newProcedureForm.get('AdmittingPhysician').setValue('');
      }
    });

    this.triggerICDCode.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.newProcedureForm.get('ICDCode').setValue('');
      }
    });

    this.triggerCPTCode.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.newProcedureForm.get('CPTCode').setValue('');
      }
    });
  }
  //#endregion ngOnInit

  //#region get methods
  getInitialAdmissionStatus() {
    this.admissionService.getInitialAdmissionStatus().then((res) => {
      this.InitialAdmissionStatus = res;
    });
  }
  getPatientArrivalCondtion() {
    this.admissionService.getPatientArrivalCondtion().then((res) => {
      this.patientArrivalCon = res;
    });
  }
  getPatientArrBy() {
    this.admissionService.getPatientArrBy().then((res) => {
      this.patientArrBy = res;
    });
  }
  getUrgenyId() {
    this.admissionService.getUrgencyId().then((res) => {
      this.UrgencyType = res;
    });
  }
  // get cptCode
  bindTreatmentCode() {
    if (this.newProcedureForm.get("CPTCode").value != null) {
      this.newProcedureForm.get("CPTCode").valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.admissionService.getAllTreatmentCodes(key).then((data) => {
              this.CPTCodes = data;
            });
          } else {
            this.CPTCodes = null;
            this.setcpttooltip = null;
          }
        }
      });
    }
  }
  //// Get Procedure Name
  bindProcedureName() {
    if (this.newProcedureForm.get("ProcedureName").value != null) {
      this.newProcedureForm
        .get("ProcedureName")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.admissionService.getAllProcedureName(key).then((data) => {
                this.proname = data;
              });
            } else {
              this.proname = null;
            }
          }
        });
    }
  }
  getProcedureType() {
    this.admissionService.getProcedureType().then((res) => {
      this.ProType = res;
    });
  }
  getadmissionType() {
    this.admissionService.getAdmissionType().then((res) => {
      this.admissiontype = res;
    });
  }
  getAdmissionNumber() {
    this.admissionService.getAdmissionNumber().then((res) => {
      this.admissionNumber = res[0];
    });
  }
  // Get Physician Name
  bindAdmittingPhysician() {
    if (this.newProcedureForm.get("AdmittingPhysician").value != null) {
      this.newProcedureForm.get("AdmittingPhysician").valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.admissionService.GetOrderingphysician(key).then((data) => {//GetOrderingphysician
              {
                this.Admit = data;
              }
            });
          } else {
            this.Admit = null;
          }
        }
      });
    }
  }
  //get Icd Codes
  bindDiagnosisCodes() {
    if (this.newProcedureForm.get("ICDCode").value != null) {
      this.newProcedureForm.get("ICDCode").valueChanges.subscribe((key: string) => {
        if (key != null) {
          if (key.length > 2) {
            this.admissionService.getAllDiagnosisCodes(key).then((data) => {
              this.ICDCode1 = data;
            });
          } else {
            this.ICDCode1 = null;
            this.seticdtooltip = null;
          }
        }
      });
    }
  }
  //#endregion get methods

  //#region Set Values
  // set Form Values
  setFormValues() {
    this.newProcedureForm.get("ProcedureType").setValue(this.data.ProcedureType);
    this.newProcedureForm.get("AdmissionType").setValue(this.data.AdmissionType);
    this.newProcedureForm.get("Urgency").setValue(this.data.UrgencyID);
    this.newProcedureForm.get("AdmissionNo").setValue(this.data.AdmissionNo);
    this.newProcedureForm.get("PreProcedureDiagnosis").setValue(this.data.PreProcedureDiagnosis);
    this.newProcedureForm.get("AdmittingPhysician").setValue(this.data.AdmittingPhysicianName);
    this.newProcedureForm.get("ICDCode").setValue(this.data.ICDCode);
    this.newProcedureForm.get("AnsthesiaFittnessRequiredCheck").setValue(this.data.AnesthesiaFitnessRequired.toString());
    this.newProcedureForm.get("BloodRequiredCheck").setValue(this.data.BloodRequired.toString());
    this.newProcedureForm.get("ProcedureName").setValue(this.data.ProcedureNameDesc);
    this.newProcedureForm.get("PlannedProcedure").setValue(this.data.PlannedProcedure);
    this.newProcedureForm.get("CPTCode").setValue(this.data.CPTCode);
    this.newProcedureForm.get("AnesthesiaRequiredDesc").setValue(this.data.AnesthesiaFitnessRequiredDesc);
    this.newProcedureForm.get("BloodRequiredDesc").setValue(this.data.BloodRequiredDesc);
    this.newProcedureForm.get("AdmissionStatus").setValue(this.data.AdmissionStatus);
    this.setcpttooltip = this.data.CPTCode;
    this.seticdtooltip = this.data.ICDCode;
  }
  //#endregion Set Values

  //#region Save Function
  submitData() {
    if (this.newProcedureForm.valid) {
      this.sendDateWithTime();
      this.ProcedureConvertModel.AdmissionID = 0;
      this.ProcedureConvertModel.ProcedureRequestId = this.data.ProcedureRequestId;
      this.ProcedureConvertModel.PatientID = this.data.PatientId;
      this.ProcedureConvertModel.AdmissionDateTime = this.getDateAndTime;
      this.ProcedureConvertModel.AdmissionNo = this.admissionNumber;
      this.ProcedureConvertModel.AdmissionOrigin = "General";
      this.ProcedureConvertModel.AdmissionType = this.newProcedureForm.get("AdmissionType").value;
      this.ProcedureConvertModel.AdmittingPhysician = this.AdmittingPhysiciannumber;
      // this.ProcedureConvertModel.Speciality = 0;
      this.ProcedureConvertModel.AdmittingReason = this.newProcedureForm.get("AdmittingReason").value;
      this.ProcedureConvertModel.PreProcedureDiagnosis = this.newProcedureForm.get("PreProcedureDiagnosis").value;
      this.ProcedureConvertModel.ICDCode = this.newProcedureForm.get("ICDCode").value;
      this.ProcedureConvertModel.ProcedureType = this.newProcedureForm.get("ProcedureType").value;
      this.ProcedureConvertModel.PlannedProcedure = this.newProcedureForm.get("PlannedProcedure").value;
      this.ProcedureConvertModel.ProcedureName = this.pronamenumber;
      this.ProcedureConvertModel.CPTCode = this.newProcedureForm.get("CPTCode").value;
      this.ProcedureConvertModel.UrgencyID = this.newProcedureForm.get("Urgency").value;
      this.ProcedureConvertModel.PatientArrivalCondition = this.newProcedureForm.get("patientArraivalConditon").value;
      this.ProcedureConvertModel.PatientArrivalBy = this.newProcedureForm.get("patientArrivalBy").value;
      this.ProcedureConvertModel.PatientExpectedStay = this.newProcedureForm.get("PatientExpectStay").value;
      this.ProcedureConvertModel.AnesthesiaFitnessRequired = this.anesthesiaBoolean;
      this.ProcedureConvertModel.AnesthesiaFitnessRequiredDesc = this.newProcedureForm.get("AnesthesiaRequiredDesc").value;
      this.ProcedureConvertModel.BloodRequired = this.bloodBoolean;
      this.ProcedureConvertModel.BloodRequiredDesc = this.newProcedureForm.get("BloodRequiredDesc").value;
      this.ProcedureConvertModel.ContinueMedication = this.data.ContinueMedication;
      this.ProcedureConvertModel.InitialAdmissionStatus = this.newProcedureForm.get("AdmissionStatus").value;
      this.ProcedureConvertModel.InstructionToPatient = this.newProcedureForm.get("InstructionToPatient").value;
      this.ProcedureConvertModel.AccompaniedBy = this.newProcedureForm.get("AccompaniedBy").value;
      this.ProcedureConvertModel.WardAndBed = this.newProcedureForm.get("WardDetails").value;
      this.ProcedureConvertModel.AdditionalInfo = this.newProcedureForm.get("AdditionalInfo").value;
      this.ProcedureConvertModel.FacilityId = this.data.FacilityId;

      this.admissionService.AddUpdateProcedure(this.ProcedureConvertModel).then((res) => {
        if (res != null) {
          this.admissionService.changeProcedureStatus(this.data.ProcedureRequestId).then((res) => {
            if (res != null) {
              this.util.showMessage("", "Procedure Request Details Saved Successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => { });
              this.dialogRef.close("Updated");
            }
          });
        }

      });
    }
  }
  //#endregion Save Function

  //#region Other Functions
  // Bind Date With Time...
  sendDateWithTime() {
    this.getDate = new Date(this.newProcedureForm.get("AdmissionDate").value);

    if (this.newProcedureForm.get("AdmissionDate").value != "") {
      if (this.newProcedureForm.get("AdmissionTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.newProcedureForm.get("AdmissionTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH = parseInt(this.newProcedureForm.get("AdmissionTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (
        this.newProcedureForm.get("AdmissionTime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.newProcedureForm.get("AdmissionTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.newProcedureForm.get("AdmissionTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.newProcedureForm.get("AdmissionTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }
    this.getDateAndTime = this.getDate;
  }

  //form reset
  CancelData() {
    this.newProcedureForm.reset();
    this.setFormValues();
    this.newProcedureForm.get("AdmissionNo").setValue(this.admissionNumber);
  }

  // //SetPrimaryCptCode
  setPrimaryCptCode(value1, value2) {
    this.setcpttooltip = value1 + " " + value2;
  }

  //SetPrimaryIcdCode
  setPrimaryIcdCode(value1, value2) {
    this.seticdtooltip = value1 + " " + value2;
  }


  //set Anesthesia Required Boolean
  setAnesthesiaFitnessRequired() {
    if (this.newProcedureForm.get("AnsthesiaFittnessRequiredCheck").value == "true") {
      this.anesthesiaBoolean = (true);
    } else {
      this.anesthesiaBoolean = (false);
    }
  }
  //set Blood Required Boolean
  setBloodRequired() {
    if (this.newProcedureForm.get("BloodRequiredCheck").value == "true") {
      this.bloodBoolean = (true);
    } else {
      this.bloodBoolean = (false);
    }
  }
  //set physician number
  setAdmittingPhysician(number) {
    this.AdmittingPhysiciannumber = number;
  }
  //Dialog Close
  dialogClose(): void {
    this.dialogRef.close();
  }
  //set Procedure number
  setProcedurename(number) {
    this.pronamenumber = number;
  }

  //#endregion Other Functions  
}
