import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PatientROSModel } from "../../../triage/models/patientROSModel";
import { NewPatientService } from "../../newPatient.service";
import { TriageService } from "../../../triage/triage.service";
import { CustomHttpService } from "../../../core/custom-http.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { UtilService } from "../../../core/util.service";
import {
  BMSMessageBoxColorMode,
  BMSMessageBoxMode,
} from "../../../ux/bmsmsgbox/bmsmsgbox.component";
import { physicalExamModel } from "../../models/physicalExamModel";

@Component({
  selector: "app-physical-exam-add",
  templateUrl: "./physical-exam-add.component.html",
  styleUrls: ["./physical-exam-add.component.css"],
})
export class PhysicalExamAddComponent implements OnInit {
  phyExamForm: FormGroup;
  physicalExamModel: physicalExamModel = new physicalExamModel();
  visitDandt: any[] = [];
  recordedDuring: any = "";
  visitID: number;
  facilityId: number = 0;
  recordby: any[] = [];
    getDate: Date;
    getDateAndTime: Date;
    getTimeHH: number;
    getTimeMin: number;
  constructor(
    public fb: FormBuilder,
    public newpatsvc: NewPatientService,
    public triageSvc: TriageService,
    private customHttpSvc: CustomHttpService,
    public dialogRef: MatDialogRef<PhysicalExamAddComponent>,
    private util: UtilService
  ) {}
  ngOnInit() {
    this.phyExamForm = this.fb.group({
      PhysicalExamID: [''],
      VisitID: [''],
      RecordedDate: [new Date(), Validators.required],
      HeadValue: ["NotEvaluated"],
      HeadDesc: [""],
      EARValue: ["NotEvaluated"],
      EARDesc: [""],
      MouthValue: ["NotEvaluated"],
      MouthDesc: [""],
      ThroatValue: ["NotEvaluated"],
      ThroatDesc: [""],
      HairValue: ["NotEvaluated"],
      HairDesc: [""],
      NeckValue: ["NotEvaluated"],
      NeckDesc: [""],
      SpineValue: ["NotEvaluated"],
      SpineDesc: [""],
      SkinValue: ["NotEvaluated"],
      SkinDesc: [""],
      LegValue: ["NotEvaluated"],
      LegDesc: [""],
      SensationValue: ["NotEvaluated"],
      SensationDesc: [""],
      EyeValue: ["NotEvaluated"],
      EyeDesc: [""],
      NoseValue: ["NotEvaluated"],
      NoseDesc: [""],
      TeethValue: ["NotEvaluated"],
      TeethDesc: [""],
      ChestValue: ["NotEvaluated"],
      ChestDesc: [""],
      ThoraxValue: ["NotEvaluated"],
      ThoraxDesc: [""],
      AbdomenValue: ["NotEvaluated"],
      AbdomenDesc: [""],
      PelvisValue: ["NotEvaluated"],
      PelvisDesc: [""],
      NailsValue: ["NotEvaluated"],
      NailsDesc: [""],
      FootValue: ["NotEvaluated"],
      FootDesc: [""],
      HandValue: ["NotEvaluated"],
      HandDesc: [""],
      Createddate: [""],
      CreatedBy: [""],
      DateTime: [""],
      ModifiedBy: [""],
      RecordedTime: [new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}), Validators.required],
      visitDateandTime: ['', Validators.required],
      RecordedDuringg: ['', Validators.required],
      RecordedByphy: ['', Validators.required],
    });
    this.getProviderNames();
    this.getVisitForPatient();

  }
  dialogClose(): void {
    this.dialogRef.close();
  }
  getProviderNames() {
    this.newpatsvc.GetProviderNames(this.facilityId).then((res) => {
      this.recordby = res;
    });
  }
  getVisitForPatient() {
    this.newpatsvc.GetVisitsForPatient(this.newpatsvc.patientId).then((res) => {
      for (var i = 0; i < res.length; i++) {
        this.visitDandt[i] = res[i].VisitDateandTime;
        //this.visitID = res[i].VisitId;
      }
    });
  }
  RecordedDuring(index: any) {
    this.newpatsvc
      .GetVisitsForPatient(this.newpatsvc.patientId)
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          if (i == index) {
            this.recordedDuring = data[i].recordedDuring;
            this.visitID = data[i].VisitId;
            this.phyExamForm.get('RecordedDuringg').setValue(this.recordedDuring);

          }
        }
      });
  }
  getData() {
      this. sendDateWithTime() ;
    if (this.phyExamForm.valid) {
      this.physicalExamModel.PhysicalExamID = 0;
      this.physicalExamModel.VisitID = this.visitID;
      this.physicalExamModel.RecordedTime = this.phyExamForm.get("RecordedTime").value;
      this.physicalExamModel.visitDateandTime = this.phyExamForm.get("visitDateandTime").value;
      this.physicalExamModel.RecordedBy = this.phyExamForm.get("RecordedByphy").value;
      this.physicalExamModel.RecordedDuring = this.recordedDuring;
      this.physicalExamModel.RecordedDate = this.getDateAndTime;
      this.physicalExamModel.HeadValue = this.phyExamForm.get("HeadValue").value;
      this.physicalExamModel.HeadDesc = this.phyExamForm.get("HeadDesc").value;
      this.physicalExamModel.EARValue = this.phyExamForm.get("EARValue").value;
      this.physicalExamModel.EARDesc = this.phyExamForm.get("EARDesc").value;
      this.physicalExamModel.MouthValue = this.phyExamForm.get("MouthValue").value;
      this.physicalExamModel.MouthDesc = this.phyExamForm.get("MouthDesc").value;
      this.physicalExamModel.ThroatValue = this.phyExamForm.get("ThroatValue").value;
      this.physicalExamModel.ThroatDesc = this.phyExamForm.get("ThroatDesc").value;
      this.physicalExamModel.HairDesc = this.phyExamForm.get("HairDesc").value;
      this.physicalExamModel.NeckValue = this.phyExamForm.get("NeckValue").value;
      this.physicalExamModel.NeckDesc = this.phyExamForm.get("NeckDesc").value;
      this.physicalExamModel.SpineValue = this.phyExamForm.get("SpineValue").value;
      this.physicalExamModel.SpineDesc = this.phyExamForm.get("SpineDesc").value;
      this.physicalExamModel.SkinValue = this.phyExamForm.get("SkinValue").value;
      this.physicalExamModel.SkinDesc = this.phyExamForm.get("SkinDesc").value;
      this.physicalExamModel.LegValue = this.phyExamForm.get("LegValue").value;
      this.physicalExamModel.LegDesc = this.phyExamForm.get("LegDesc").value;
      this.physicalExamModel.SensationValue = this.phyExamForm.get("SensationValue").value;
      this.physicalExamModel.SensationDesc = this.phyExamForm.get("SensationDesc").value;
      this.physicalExamModel.EyeValue = this.phyExamForm.get("EyeValue").value;
      this.physicalExamModel.EyeDesc = this.phyExamForm.get("EyeDesc").value;
      this.physicalExamModel.NoseValue = this.phyExamForm.get("NoseValue").value;
      this.physicalExamModel.NoseDesc = this.phyExamForm.get("NoseDesc").value;
      this.physicalExamModel.TeethValue = this.phyExamForm.get("TeethValue").value;
      this.physicalExamModel.TeethDesc = this.phyExamForm.get("TeethDesc").value;
      this.physicalExamModel.ChestValue = this.phyExamForm.get("ChestValue").value;
      this.physicalExamModel.ChestDesc = this.phyExamForm.get("ChestDesc").value;
      this.physicalExamModel.ThoraxValue = this.phyExamForm.get("ThoraxValue").value;
      this.physicalExamModel.ThoraxDesc = this.phyExamForm.get("ThoraxDesc").value;
      this.physicalExamModel.AbdomenValue = this.phyExamForm.get("AbdomenValue").value;
      this.physicalExamModel.AbdomenDesc = this.phyExamForm.get("AbdomenDesc").value;
      this.physicalExamModel.PelvisValue = this.phyExamForm.get("PelvisValue").value;
      this.physicalExamModel.PelvisDesc = this.phyExamForm.get("PelvisDesc").value;
      this.physicalExamModel.NailsValue = this.phyExamForm.get("NailsValue").value;
      this.physicalExamModel.NailsDesc = this.phyExamForm.get("NailsDesc").value;
      this.physicalExamModel.FootValue = this.phyExamForm.get("FootValue").value;
      this.physicalExamModel.FootDesc = this.phyExamForm.get("FootDesc").value;
      this.physicalExamModel.HandValue = this.phyExamForm.get("HandValue").value;
      this.physicalExamModel.HandDesc = this.phyExamForm.get("HandDesc").value;
      this.physicalExamModel.HairValue = this.phyExamForm.get("HairValue").value;

      this.triageSvc.addUpdatephysicalexamForVisit(this.physicalExamModel).then((res) => {
        this.util
          .showMessage(
            "",
            "Physical exam details saved successfully",
            BMSMessageBoxColorMode.Information,
            BMSMessageBoxMode.MessageBox
          )
          .then((res) => { });
        this.dialogRef.close("update");
      });
    }
  }
  
  cancelForm() {
    this.phyExamForm.reset();
    this.phyExamForm.get('RecordedTime').setValue(new Date().toLocaleString([], { hour12: true, hour: '2-digit', minute: '2-digit'}));
    this.recordedDuring = "";
    this.phyExamForm = this.fb.group({
      PhysicalExamID: [""],
      VisitID: [""],
      RecordedDate: ["validators.required"],
      RecordedBy: ["validators.required"],
      HeadValue: ["NotEvaluated"],
      HeadDesc: [""],
      EARValue: ["NotEvaluated"],
      EARDesc: [""],
      MouthValue: ["NotEvaluated"],
      MouthDesc: [""],
      ThroatValue: ["NotEvaluated"],
      ThroatDesc: [""],
      HairValue: ["NotEvaluated"],
      HairDesc: [""],
      NeckValue: ["NotEvaluated"],
      NeckDesc: [""],
      SpineValue: ["NotEvaluated"],
      SpineDesc: [""],
      SkinValue: ["NotEvaluated"],
      SkinDesc: [""],
      LegValue: ["NotEvaluated"],
      LegDesc: [""],
      SensationValue: ["NotEvaluated"],
      SensationDesc: [""],
      EyeValue: ["NotEvaluated"],
      EyeDesc: [""],
      NoseValue: ["NotEvaluated"],
      NoseDesc: [""],
      TeethValue: ["NotEvaluated"],
      TeethDesc: [""],
      ChestValue: ["NotEvaluated"],
      ChestDesc: [""],
      ThoraxValue: ["NotEvaluated"],
      ThoraxDesc: [""],
      AbdomenValue: ["NotEvaluated"],
      AbdomenDesc: [""],
      PelvisValue: ["NotEvaluated"],
      PelvisDesc: [""],
      NailsValue: ["NotEvaluated"],
      NailsDesc: [""],
      FootValue: ["NotEvaluated"],
      FootDesc: [""],
      HandValue: ["NotEvaluated"],
      HandDesc: [""],
      Createddate: [""],
      CreatedBy: [""],
      DateTime: [""],
      ModifiedBy: [""],
     // RecordedTime: [""],
      visitDateandTime: [""],
      RecordedDuringg: [""],
      RecordedByphy: [""],
     
    });   
  }
  sendDateWithTime() {
    this.getDate = new Date(this.phyExamForm.get("RecordedDate").value);

    if (this.phyExamForm.get("RecordedDate").value != "") {
      if (
        this.phyExamForm
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "pm"
      ) {
        if (
          parseInt(
            this.phyExamForm
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 12;
        } else {
          this.getTimeHH =
            parseInt(
              this.phyExamForm
                .get("RecordedTime")
                .value.toString()
                .split(" ")[0]
                .toString()
                .split(":")[0]
            ) + 12;
        }
      } else if (
        this.phyExamForm
          .get("RecordedTime")
          .value.toString()
          .toLowerCase()
          .split(" ")[1] == "am"
      ) {
        if (
          parseInt(
            this.phyExamForm
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          ) == 12
        ) {
          this.getTimeHH = 0;
        } else {
          this.getTimeHH = parseInt(
            this.phyExamForm
              .get("RecordedTime")
              .value.toString()
              .split(" ")[0]
              .toString()
              .split(":")[0]
          );
        }
      }
      this.getTimeMin = parseInt(
        this.phyExamForm
          .get("RecordedTime")
          .value.toString()
          .split(" ")[0]
          .toString()
          .split(":")[1]
      );
      this.getDate.setHours(this.getTimeHH, this.getTimeMin, 0, 0);
    }

    this.getDateAndTime = this.getDate;
  }
}
