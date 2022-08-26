import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddProcedureRequestModel } from "../models/AddProcedureRequestModel";
import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CustomHttpService } from "../../core/custom-http.service";
import { TriageService } from "../triage.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "src/app/ux/bmsmsgbox/bmsmsgbox.component";
import { UtilService } from "../../core/util.service";

@Component({
  selector: "add-procedure-request",
  templateUrl: "./add-procedure-request.component.html",
  styleUrls: ["./add-procedure-request.component.css"],
})
export class AddProcedureRequestComponent implements OnInit {

  //#region property declaration
  addProcedureRequestForm: FormGroup;
  AddProcedureReq: AddProcedureRequestModel = new AddProcedureRequestModel();
  AdmittingPhysician: any;
  UrgencyType: any;
  admissionType: any;
  procedureType: any;
  getDateAndTime: any;
  CPTCodes: any;
  ICDCodes: any;
  ProcedureName: any;
  visitDandTAndName: any;
  setFormValues: any;
  anesthiaBoolean: boolean;
  bloodBoolean: boolean;
  ProcedureRequestIdNumber: number = 0;
  icdTooltip: any;
  cptTooltip: any;
  procedureTooltip: any;
  buttonHidden: boolean = true;
  @ViewChild('autoCompleteProcedureName', { static: false, read: MatAutocompleteTrigger }) triggerProcedureName: MatAutocompleteTrigger;
  @ViewChild('autoCompleteAdmittingPhysician', { static: false, read: MatAutocompleteTrigger }) triggerAdmittingPhysician: MatAutocompleteTrigger;
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICDCode: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCPTCode', { static: false, read: MatAutocompleteTrigger }) triggerCPTCode: MatAutocompleteTrigger;
  //#endregion property declaration

  //#region constructor
  constructor(
    private customHttpSvc: CustomHttpService,
    private fb: FormBuilder,
    public triageService: TriageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddProcedureRequestComponent>,
    private util: UtilService
  ) { }
  //#endregion constructor

  //#region ngOnInit
  ngOnInit() {
    this.customHttpSvc.getDbName(localStorage.getItem("DatabaseName"));

    this.addProcedureRequestForm = this.fb.group({
      procedureRequestVDT: [""],
      RequestPhysician: [""],
      procedureRequestTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      ProcedureRequestId: [""],
      ProcedureRequestedDate: [new Date(), Validators.required],
      ProcedureType: ["", Validators.required],
      AdmittingPhysicianCheck: ["", Validators.required],
      AdmittingPhysician: ["", Validators.required],
      ApproximateDuration: [""],
      UrgencyID: ["", Validators.required],
      PreProcedureDiagnosis: ["", Validators.required],
      ICDCode: [""],
      PlannedProcedure: ["", Validators.required],
      ProcedureName: [""],
      ProcedureNamecheck: ["", Validators.required],
      CPTCode: [""],
      AnesthesiaFitnessRequired: [""],
      AnesthesiaFitnessRequiredCheck: ["", Validators.required],
      BloodRequired: [""],
      BloodRequiredCheck: ["", Validators.required],
      ContinueMedication: false,
      StopMedication: false,
      SpecialPreparation: false,
      SpecialPreparationNotes: [""],
      DietInstructions: false,
      DietInstructionsNotes: [""],
      OtherInstructions: false,
      OtherInstructionsNotes: [""],
      Cardiology: false,
      Nephrology: false,
      Neurology: false,
      OtherConsults: false,
      OtherConsultsNotes: [""],
      AdmissionType: ["", Validators.required],
      PatientExpectedStay: [""],
      InstructionToPatient: [""],
      AdditionalInfo: [""],
      MedicineType: ["", Validators.required],
      AnesthesiaFitnessRequiredDesc: ["", Validators.required],
      BloodRequiredDesc: ["", Validators.required],
      ProviderName: [""],
      VisitDateandTime: [""],
    });

    this.getUrgenyId();
    this.getProcedureType();
    this.getadmissionType();
    this.bindTreatmentCode();
    this.bindAdmittingPhysician();
    this.bindDiagnosisCodes();
    this.bindProcedureName();
    this.getOneAdmittingPhysician();
    this.setValuesOfForm();

  }
  ngAfterViewInit() {
    this.triggerProcedureName.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.addProcedureRequestForm.get('ProcedureNamecheck').setValue('');
      }
    });

    this.triggerAdmittingPhysician.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.addProcedureRequestForm.get('AdmittingPhysicianCheck').setValue('');
      }
    });

    this.triggerICDCode.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.addProcedureRequestForm.get('ICDCode').setValue('');
      }
    });

    this.triggerCPTCode.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.addProcedureRequestForm.get('CPTCode').setValue('');
      }
    });
  }
  //#endregion ngOnInit

  //#region get Methods
  // reset
  CancelData() {
    this.addProcedureRequestForm.reset();
    this.addProcedureRequestForm.get('ProcedureRequestedDate').setValue(new Date());
    this.addProcedureRequestForm.get('procedureRequestTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.getOneAdmittingPhysician();
    this.setValuesOfForm();
  }

  // get urgency id
  getUrgenyId() {
    this.triageService.getUrgencyId().then((res) => {
      this.UrgencyType = res;
    });
  }

  // get procedure type
  getProcedureType() {
    this.triageService.getProcedureType().then((res) => {
      this.procedureType = res;
    });
  }

  //get admission type
  getadmissionType() {
    this.triageService.getadmissionType().then((res) => {
      this.admissionType = res;
    });
  }

  // set boolean value of anesthesia
  setAnesthesiaFitnessRequired() {
    if (this.addProcedureRequestForm.get("AnesthesiaFitnessRequiredCheck").value == "true") {
      this.anesthiaBoolean = true;
    } else {
      this.anesthiaBoolean = false;
    }
  }

  // set boolean value of blood
  setBloodRequired() {
    if (this.addProcedureRequestForm.get("BloodRequiredCheck").value == "true") {
      this.bloodBoolean = true;
    } else {
      this.bloodBoolean = false;
    }
  }

  // set boolean value of continue /stop
  Medicine() {
    if (this.addProcedureRequestForm.get("MedicineType").value == "ContinueMedication") {
      this.addProcedureRequestForm.get("ContinueMedication").setValue(true);
      this.addProcedureRequestForm.get("StopMedication").setValue(false);
    }
    if (this.addProcedureRequestForm.get("MedicineType").value == "StopMedication") {
      this.addProcedureRequestForm.get("StopMedication").setValue(true);
      this.addProcedureRequestForm.get("ContinueMedication").setValue(false);
    }
  }

  // get cpt code
  bindTreatmentCode() {
    if (this.addProcedureRequestForm.get("CPTCode").value != null) {
      this.addProcedureRequestForm
        .get("CPTCode")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllTreatmentCodes(key).then((data) => {
                this.CPTCodes = data;
              });
            } else {
              this.CPTCodes = null;
              this.cptTooltip = null;
            }
          }
          else {
            this.cptTooltip = null;
          }
        });
    }
  }

  setCPTTooltip(value1, value2) {
    this.cptTooltip = value1 + ' ' + value2;
  }

  //get procedure name
  bindProcedureName() {
    if (this.addProcedureRequestForm.get("ProcedureNamecheck").value != null) {
      this.addProcedureRequestForm
        .get("ProcedureNamecheck")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllProcedureName(key).then((data) => {
                this.ProcedureName = data;
              });
            } else {
              this.ProcedureName = null;
            }
          }
        });
    }
  }

  // get physician
  bindAdmittingPhysician() {
    if (
      this.addProcedureRequestForm.get("AdmittingPhysicianCheck").value != null
    ) {
      this.addProcedureRequestForm
        .get("AdmittingPhysicianCheck")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.GetDoctorname(key).then((data) => {
                this.AdmittingPhysician = data;
              });
            } else {
              this.AdmittingPhysician = null;
            }
          }
        });
    }
  }

  //get icd code
  bindDiagnosisCodes() {
    if (this.addProcedureRequestForm.get("ICDCode").value != null) {
      this.addProcedureRequestForm
        .get("ICDCode")
        .valueChanges.subscribe((key: string) => {
          if (key != null) {
            if (key.length > 2) {
              this.triageService.getAllDiagnosisCodes(key).then((data) => {
                this.ICDCodes = data;
              });
            } else {
              this.ICDCodes = null;
              this.icdTooltip = null;
            }
          }
          else {
            this.icdTooltip = null;
          }
        });
    }
  }

  setICDTooltip(value1, value2) {
    this.icdTooltip = value1 + ' ' + value2;
  }
  // close
  dialogClose(): void {
    this.dialogRef.close();
  }

  // Bind Date With Time...
  sendDateWithTime() {
    let getDate = new Date(this.addProcedureRequestForm.get("ProcedureRequestedDate").value);
    let getTimeHH: any;
    let getTimeMin: any;

    if (this.addProcedureRequestForm.get("ProcedureRequestedDate").value != "") {
      if (this.addProcedureRequestForm.get("procedureRequestTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (parseInt(this.addProcedureRequestForm.get("procedureRequestTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          getTimeHH = 12;
        }
        else {
          getTimeHH = parseInt(this.addProcedureRequestForm.get("procedureRequestTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      }
      else if (this.addProcedureRequestForm.get("procedureRequestTime").value.toString().toLowerCase().split(" ")[1] == "am") {
        if (parseInt(this.addProcedureRequestForm.get("procedureRequestTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12) {
          getTimeHH = 0;
        } else {
          getTimeHH = parseInt(this.addProcedureRequestForm.get("procedureRequestTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      getTimeMin = parseInt(this.addProcedureRequestForm.get("procedureRequestTime").value.toString().split(" ")[0].toString().split(":")[1]);
      getDate.setHours(getTimeHH, getTimeMin, 0, 0);
    }
    this.getDateAndTime = getDate;
  }

  setProcedurename(number, value) {
    this.addProcedureRequestForm.get("ProcedureName").setValue(number);
    this.procedureTooltip = value;
  }
  setAdmittingPhysician(number) {
    this.addProcedureRequestForm.get("AdmittingPhysician").setValue(number);
  }
  getOneAdmittingPhysician() {
    this.triageService.getOneAdmittingPhysician(this.data[1]).then((res) => {
      this.visitDandTAndName = res;
      this.addProcedureRequestForm.get("VisitDateandTime").setValue(this.visitDandTAndName.VisitDateandTime);
      this.addProcedureRequestForm.get("ProviderName").setValue(this.visitDandTAndName.ProviderName);
    });
  }

  //#endregion get Methods

  //#region set values
  // set values
  setValuesOfForm() {
    this.triageService.getDataOfProcedure(this.data[1]).then((res) => {
      this.setFormValues = res;
      if (this.setFormValues) {
        if (this.setFormValues.ProcedureRequestStatus == "Confirmed") {
          this.addProcedureRequestForm.disable();
          this.buttonHidden = false;
        }
        this.ProcedureRequestIdNumber = this.setFormValues.ProcedureRequestId;
        this.addProcedureRequestForm.get("ProcedureRequestedDate").setValue(new Date(this.setFormValues.ProcedureRequestedDate));
        this.addProcedureRequestForm.get("procedureRequestTime").setValue(new Date(this.setFormValues.ProcedureRequestedDate).toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
        this.addProcedureRequestForm.get("ProcedureType").setValue(this.setFormValues.ProcedureType);
        this.addProcedureRequestForm.get("AdmittingPhysicianCheck").setValue(this.setFormValues.AdmittingPhysicianName);
        this.addProcedureRequestForm.get("AdmittingPhysician").setValue(this.setFormValues.AdmittingPhysician);
        this.addProcedureRequestForm.get("ApproximateDuration").setValue(this.setFormValues.ApproximateDuration);
        this.addProcedureRequestForm.get("UrgencyID").setValue(this.setFormValues.UrgencyID);
        this.addProcedureRequestForm.get("PreProcedureDiagnosis").setValue(this.setFormValues.PreProcedureDiagnosis);
        this.addProcedureRequestForm.get("ICDCode").setValue(this.setFormValues.ICDCode);
        this.icdTooltip = this.setFormValues.ICDCode;
        this.addProcedureRequestForm.get("PlannedProcedure").setValue(this.setFormValues.PlannedProcedure);
        this.addProcedureRequestForm.get("ProcedureNamecheck").setValue(this.setFormValues.ProcedureNameDesc);
        this.procedureTooltip = this.setFormValues.ProcedureNameDesc;
        this.addProcedureRequestForm.get("ProcedureName").setValue(this.setFormValues.ProcedureName);
        this.addProcedureRequestForm.get("CPTCode").setValue(this.setFormValues.CPTCode);
        this.cptTooltip = this.setFormValues.CPTCode;
        this.addProcedureRequestForm.get("AnesthesiaFitnessRequiredCheck").setValue(this.setFormValues.AnesthesiaFitnessRequired.toString());
        this.anesthiaBoolean = this.setFormValues.AnesthesiaFitnessRequired;
        this.addProcedureRequestForm.get("AnesthesiaFitnessRequiredDesc").setValue(this.setFormValues.AnesthesiaFitnessRequiredDesc);
        this.addProcedureRequestForm.get("BloodRequiredCheck").setValue(this.setFormValues.BloodRequired.toString());
        this.bloodBoolean = this.setFormValues.BloodRequired;
        this.addProcedureRequestForm.get("BloodRequiredDesc").setValue(this.setFormValues.BloodRequiredDesc);
        if (this.setFormValues.ContinueMedication) {
          this.addProcedureRequestForm.get("MedicineType").setValue("ContinueMedication");
        }
        if (this.setFormValues.StopMedication) {
          this.addProcedureRequestForm.get("MedicineType").setValue("StopMedication");
        }
        this.addProcedureRequestForm.get("ContinueMedication").setValue(this.setFormValues.ContinueMedication);
        this.addProcedureRequestForm.get("StopMedication").setValue(this.setFormValues.StopMedication);
        this.addProcedureRequestForm.get("SpecialPreparation").setValue(this.setFormValues.SpecialPreparation);
        this.addProcedureRequestForm.get("SpecialPreparationNotes").setValue(this.setFormValues.SpecialPreparationNotes);
        this.addProcedureRequestForm.get("DietInstructions").setValue(this.setFormValues.DietInstructions);
        this.addProcedureRequestForm.get("DietInstructionsNotes").setValue(this.setFormValues.DietInstructionsNotes);
        this.addProcedureRequestForm.get("OtherInstructions").setValue(this.setFormValues.OtherInstructions);
        this.addProcedureRequestForm.get("OtherInstructionsNotes").setValue(this.setFormValues.OtherInstructionsNotes);
        this.addProcedureRequestForm.get("Cardiology").setValue(this.setFormValues.Cardiology);
        this.addProcedureRequestForm.get("Nephrology").setValue(this.setFormValues.Nephrology);
        this.addProcedureRequestForm.get("Neurology").setValue(this.setFormValues.Neurology);
        this.addProcedureRequestForm.get("OtherConsults").setValue(this.setFormValues.OtherConsults);
        this.addProcedureRequestForm.get("OtherConsultsNotes").setValue(this.setFormValues.OtherConsultsNotes);
        this.addProcedureRequestForm.get("AdmissionType").setValue(this.setFormValues.AdmissionType);
        this.addProcedureRequestForm.get("PatientExpectedStay").setValue(this.setFormValues.PatientExpectedStay);
        this.addProcedureRequestForm.get("InstructionToPatient").setValue(this.setFormValues.InstructionToPatient);
        this.addProcedureRequestForm.get("AdditionalInfo").setValue(this.setFormValues.AdditionalInfo);
      }
    });
  }
  //#endregion set values

  //#region save function

  // save data
  submitData() {
    if (this.addProcedureRequestForm.valid) {
      this.sendDateWithTime();
      this.AddProcedureReq.AdditionalInfo = this.addProcedureRequestForm.get("AdditionalInfo").value;
      this.AddProcedureReq.ProcedureRequestedDate = this.getDateAndTime;
      this.AddProcedureReq.ProcedureRequestId = this.ProcedureRequestIdNumber;
      this.AddProcedureReq.VisitID = this.data[1];
      this.AddProcedureReq.ProcedureType = this.addProcedureRequestForm.get("ProcedureType").value;
      this.AddProcedureReq.AdmittingPhysician = this.addProcedureRequestForm.get("AdmittingPhysician").value;
      this.AddProcedureReq.ApproximateDuration = this.addProcedureRequestForm.get("ApproximateDuration").value;
      this.AddProcedureReq.UrgencyID = this.addProcedureRequestForm.get("UrgencyID").value;
      this.AddProcedureReq.PreProcedureDiagnosis = this.addProcedureRequestForm.get("PreProcedureDiagnosis").value;
      this.AddProcedureReq.ICDCode = this.addProcedureRequestForm.get("ICDCode").value;
      this.AddProcedureReq.PlannedProcedure = this.addProcedureRequestForm.get("PlannedProcedure").value;
      this.AddProcedureReq.ProcedureName = this.addProcedureRequestForm.get("ProcedureName").value;
      this.AddProcedureReq.CPTCode = this.addProcedureRequestForm.get("CPTCode").value;
      this.AddProcedureReq.AnesthesiaFitnessRequired = this.anesthiaBoolean;
      this.AddProcedureReq.BloodRequired = this.bloodBoolean;
      this.AddProcedureReq.ContinueMedication = this.addProcedureRequestForm.get("ContinueMedication").value;
      this.AddProcedureReq.StopMedication = this.addProcedureRequestForm.get("StopMedication").value;
      this.AddProcedureReq.SpecialPreparation = this.addProcedureRequestForm.get("SpecialPreparation").value;
      this.AddProcedureReq.SpecialPreparationNotes = this.addProcedureRequestForm.get("SpecialPreparationNotes").value;
      this.AddProcedureReq.DietInstructions = this.addProcedureRequestForm.get("DietInstructions").value;
      this.AddProcedureReq.DietInstructionsNotes = this.addProcedureRequestForm.get("DietInstructionsNotes").value;
      this.AddProcedureReq.OtherInstructions = this.addProcedureRequestForm.get("OtherInstructions").value;
      this.AddProcedureReq.OtherInstructionsNotes = this.addProcedureRequestForm.get("OtherInstructionsNotes").value;
      this.AddProcedureReq.Cardiology = this.addProcedureRequestForm.get("Cardiology").value;
      this.AddProcedureReq.Nephrology = this.addProcedureRequestForm.get("Nephrology").value;
      this.AddProcedureReq.Neurology = this.addProcedureRequestForm.get("Neurology").value;
      this.AddProcedureReq.OtherConsults = this.addProcedureRequestForm.get("OtherConsults").value;
      this.AddProcedureReq.OtherConsultsNotes = this.addProcedureRequestForm.get("OtherConsultsNotes").value;
      this.AddProcedureReq.AdmissionType = this.addProcedureRequestForm.get("AdmissionType").value;
      this.AddProcedureReq.PatientExpectedStay = this.addProcedureRequestForm.get("PatientExpectedStay").value;
      this.AddProcedureReq.InstructionToPatient = this.addProcedureRequestForm.get("InstructionToPatient").value;
      this.AddProcedureReq.AnesthesiaFitnessRequiredDesc = this.addProcedureRequestForm.get("AnesthesiaFitnessRequiredDesc").value;
      this.AddProcedureReq.BloodRequiredDesc = this.addProcedureRequestForm.get("BloodRequiredDesc").value;

      this.triageService.AddUpdateAddProcedureRequest(this.AddProcedureReq).then((res) => {
        if (res != null && res.ProcedureRequestId > 0) {
          this.util.showMessage("Succes", "Procedure Request Details Saved Successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox).then((res) => {
            if (res) { this.dialogRef.close("update"); }
          });
        }
      });
    }
  }
  //#endregion

}
