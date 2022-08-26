import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PatientAllergyModel } from "../../../triage/models/PatientAllergyModel";
import { NewPatientService } from "../../newPatient.service";

import { MatAutocompleteTrigger, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TriageService } from "../../../triage/triage.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { UtilService } from "../../../core/util.service";

@Component({
  selector: "app-add-allergies",
  templateUrl: "./add-allergies.component.html",
  styleUrls: ["./add-allergies.component.css"],
})
export class AddAllergiesComponent implements OnInit {
  allergiesForm: FormGroup;
  allergiesModel: PatientAllergyModel = new PatientAllergyModel();

  recordedDuring: any = "";
  patientID: any;
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
  @ViewChild('autoCompleteICDCode', { static: false, read: MatAutocompleteTrigger }) triggerICD: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSnomedCode', { static: false, read: MatAutocompleteTrigger }) triggerSnomed: MatAutocompleteTrigger;

  constructor(
    public newPatientService: NewPatientService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAllergiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public triageService: TriageService,
    public custHttp: CustomHttpService,
    private util: UtilService
  ) { }

  ngOnInit() {
    this.custHttp.getDbName(localStorage.getItem("DatabaseName"));
    this.allergiesForm = this.fb.group({
      AllergyId: [""],
      AllergyTypeID: ["", Validators.required],
      Name: ["", Validators.required],
      Allergydescription: [""],
      Aggravatedby: [""],
      Alleviatedby: [""],
      Onsetdate: [""],
      AllergySeverityID: ["", Validators.required],
      Reaction: [""],
      Status: [""],
      ICD10: [""],
      SNOMED: [""],
      Notes: [""],
      VisitDateandTime: ["", Validators.required],
      RecordedDate: [new Date(), Validators.required],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      recordedDuring: ["", Validators.required],
      RecordedBy: ["", Validators.required],
    });
    this.bindVisitDateAndTime();
    this.bindProviderName();
    this.bindAllergyTypes();
    this.bindAllergySeverities();
    this.bindAllDiagnosisCodes();
    this.bindAllSnomedCTCodes();
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
  //Submit allergy
  addAllergies() {
    if (this.allergiesForm.valid) {
      this.sendDateWithTime();
      this.allergiesModel.AllergyId = 0;
      this.allergiesModel.PatientId = this.newPatientService.patientId;
      this.allergiesModel.VisitId = this.visitId;
      this.allergiesModel.RecordedDate = this.getDateAndTime;
      this.allergiesModel.RecordedBy =
        this.allergiesForm.get("RecordedBy").value;
      this.allergiesModel.AllergyTypeID =
        this.allergiesForm.get("AllergyTypeID").value;
      this.allergiesModel.Name = this.allergiesForm.get("Name").value;
      this.allergiesModel.Allergydescription =
        this.allergiesForm.get("Allergydescription").value;
      this.allergiesModel.Aggravatedby =
        this.allergiesForm.get("Aggravatedby").value;
      this.allergiesModel.Alleviatedby =
        this.allergiesForm.get("Alleviatedby").value;
      this.allergiesModel.Onsetdate = this.allergiesForm.get("Onsetdate").value;
      this.allergiesModel.AllergySeverityID =
        this.allergiesForm.get("AllergySeverityID").value;
      this.allergiesModel.Reaction = this.allergiesForm.get("Reaction").value;
      this.allergiesModel.Status = this.allergiesForm.get("Status").value;
      this.allergiesModel.ICD10 = this.allergiesForm.get("ICD10").value;
      this.allergiesModel.SNOMED = this.allergiesForm.get("SNOMED").value;
      this.allergiesModel.Notes = this.allergiesForm.get("Notes").value;
      this.newPatientService
        .AddUpdateAllergiesForVisit(this.allergiesModel)
        .then((res) => {
          this.util
            .showMessage(
              "",
              "Allergy details saved successfully",
              BMSMessageBoxColorMode.Information,
              BMSMessageBoxMode.MessageBox
            )
            .then((res) => { });
          this.dialogRef.close("Updated");
        });
    }
  }
  //Visit Date and Time
  bindVisitDateAndTime() {
    this.newPatientService
      .GetVisitsForPatient(this.newPatientService.patientId)
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          this.visitDateTime[i] = res[i].VisitDateandTime;
          this.visitId = res[i].VisitId;
        }
      });
  }
  //Record During
  RecordedDuring(data: any) {
    this.newPatientService
      .GetVisitsForPatient(this.newPatientService.patientId)
      .then((res) => {
        for (let x = 0; x < res.length; x++) {
          if (x == data) {
            this.recordedDuring = res[x].recordedDuring;
            this.allergiesForm.get("recordedDuring").setValue(this.recordedDuring);
          }
        }
      });
  }
  //Record By
  bindProviderName() {
    this.newPatientService.GetProviderNames(this.facilityId).then((res) => {
      this.recordedBy = res;
    });
  }
  //Allergy Type
  bindAllergyTypes() {
    this.triageService.getAllergyTypes().then((data) => {
      this.allergyType = data;
    });
  }
  //Severity
  bindAllergySeverities() {
    this.triageService.getAllergySeverities().then((data) => {
      this.AllergySeverities = data;
    });
  }
  //close
  dialogClose(): void {
    this.dialogRef.close();
  }
  //icdcode
  bindAllDiagnosisCodes() {
    this.allergiesForm.get("ICD10").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllDiagnosisCodes(key).then((data) => {
            this.diagnosisCode = data;
          });
        } else {
          this.diagnosisCode = null;
          this.icdtooltip = null;
        }
      }
    });
  }
  //snomed
  bindAllSnomedCTCodes() {
    this.allergiesForm.get("SNOMED").valueChanges.subscribe((key: string) => {
      if (key != null) {
        if (key.length > 2) {
          this.triageService.getAllSnomedCTCodes(key).then((data) => {
            this.snomedCTCode = data;

          });
        } else {
          this.snomedCTCode = null;
          this.snoomedtooltip = null;
        }
      }
    });
  }
  //Date and Time
  sendDateWithTime() {
    this.getDate = new Date(this.allergiesForm.get("RecordedDate").value);

    if (this.allergiesForm.get("RecordedDate").value != "") {
      if (this.allergiesForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "pm") {
        if (
          parseInt(
            this.allergiesForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH =
            parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) + 12;
        }
      } else if (
        this.allergiesForm.get("RecordedTime").value.toString().toLowerCase().split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.allergiesForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[0]);
        }
      }
      this.getTimeMin = parseInt(this.allergiesForm.get("RecordedTime").value.toString().split(" ")[0].toString().split(":")[1]);
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }
  //Close
  closeForm() {
    this.allergiesForm.reset();
    this.recordedDuring = "";
  }
  getallergyStatusvalue() {
    this.triageService.getallergyStatusvalue().then((res) => {
      this.allergyStatusvalue = res;
    });
  }

  //Set icd code
  setIcdCode(value1, value2) {
    this.icdtooltip = value1 + " " + value2;
  }
  //Set Cpt Code
  setCptCode(value1, value2) {
    this.snoomedtooltip = value1 + " " + value2;
  }
}
